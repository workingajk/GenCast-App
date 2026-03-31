import json
import random
import re

# Same exact Voice Bank from generate_training_data
VOICE_BANK = [
    {"voice": "en-US-GuyNeural", "pitch_range": (0, 15), "rate_range": (5, 15)},
    {"voice": "en-US-JennyNeural", "pitch_range": (-5, 5), "rate_range": (0, 10)},
    {"voice": "en-US-AriaNeural", "pitch_range": (-10, 0), "rate_range": (-5, 5)},
    {"voice": "en-US-AnaNeural", "pitch_range": (15, 30), "rate_range": (10, 25)},
    {"voice": "en-US-ChristopherNeural", "pitch_range": (-10, 5), "rate_range": (-5, 10)},
    {"voice": "en-US-EricNeural", "pitch_range": (-20, -5), "rate_range": (-15, -5)},
    {"voice": "en-US-MichelleNeural", "pitch_range": (5, 15), "rate_range": (5, 15)},
    {"voice": "en-US-RogerNeural", "pitch_range": (-20, -10), "rate_range": (-15, -5)},
    {"voice": "en-US-SteffanNeural", "pitch_range": (0, 10), "rate_range": (-5, 5)},
]

def format_signed(num):
    return f"+{num}" if num >= 0 else str(num)

def get_voice_bounds(voice_id):
    for v in VOICE_BANK:
        if v["voice"] == voice_id:
            return v["pitch_range"], v["rate_range"]
    return (-5, 5), (-5, 5)

def fix_data():
    filepath = "evaluations/training_data_scripting.jsonl"
    fixed_lines = []
    
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    for line in lines:
        try:
            data = json.loads(line)
        except:
            continue
            
        old_instruction = data.get("instruction", "")
        
        # 1. Strip the exact Pitch/Rate/Voice from the Instruction, extract only Persona
        if "(Voice:" in old_instruction:
            # We look for something like: Host (Voice: en-US-GuyNeural, Persona: An energetic young man, Pitch: +12Hz, Rate: +10%)
            match_personas = re.findall(r'([A-Za-z0-9 ]+)\s*\(Voice:.*?, Persona:\s*(.*?),\s*Pitch:', old_instruction)
            
            if match_personas:
                speaker_desc_only = ", ".join([f"{role.strip()} (Persona: {persona.strip()})" for role, persona in match_personas])
                speaker_count = len(match_personas)
                
                new_instruction = f"Write a {speaker_count}-speaker podcast script using the provided outline and research context.\n\nSpeaker Characteristics:\n{speaker_desc_only}\n\nIMPORTANT: Ensure the dialogue reflects each speaker's distinct personality, knowledge level, role, and background as defined above.\n\nAvailable Voices for Selection:\n- en-US-GuyNeural (Male, Adult)\n- en-US-JennyNeural (Female, Adult)\n- en-US-AriaNeural (Female, Adult)\n- en-US-AnaNeural (Female, Child, young and bright)\n- en-US-ChristopherNeural (Male, Adult)\n- en-US-EricNeural (Male, Adult, deep or older voice)\n- en-US-MichelleNeural (Female, Adult)\n- en-US-RogerNeural (Male, Adult)\n- en-US-SteffanNeural (Male, Adult)\n\nCRITICAL INSTRUCTION FOR VOICE ACTING:\nFor each line of dialogue, you MUST assign an appropriate `voice` ONLY from the \"Available Voices\" list above that best matches the speaker's characteristics. You MUST also optionally specify `pitch` and `rate` to accurately reflect their age and energy level if it deviates from a standard adult. FORMAT RULES FOR PITCH AND RATE:\n- `pitch` MUST be formatted as \"+<number>Hz\" or \"-<number>Hz\". \n- `rate` MUST be formatted as \"+<number>%\" or \"-<number>%\".\n- If no adjustment is needed, default to \"+0Hz\" and \"+0%\"."
                
                data["instruction"] = new_instruction
                
        # 2. Fix the Output JSON if Pitch/Rate is 0
        try:
            out_json = json.loads(data["output"])
            if isinstance(out_json, list):
                script_list = out_json
            elif isinstance(out_json, dict) and "script" in out_json:
                script_list = out_json["script"]
            else:
                script_list = []
                
            # Keep track of assigned random pitch for consistency across turns
            speaker_pitch_map = {}
            for turn in script_list:
                voice = turn.get("voice", "en-US-GuyNeural")
                speaker = turn.get("speaker", "Host")
                
                if speaker not in speaker_pitch_map:
                    p_range, r_range = get_voice_bounds(voice)
                    rand_pitch = f"{format_signed(random.randint(p_range[0], p_range[1]))}Hz"
                    rand_rate = f"{format_signed(random.randint(r_range[0], r_range[1]))}%"
                    speaker_pitch_map[speaker] = {"pitch": rand_pitch, "rate": rand_rate}
                    
                # Fix values if they were hallucinated to defaults
                turn["pitch"] = speaker_pitch_map[speaker]["pitch"]
                turn["rate"]  = speaker_pitch_map[speaker]["rate"]
                
            data["output"] = json.dumps(script_list)
        except Exception as e:
            print(f"Skipping JSON repair for line: {e}")
            
        fixed_lines.append(data)
        
    with open(filepath, "w", encoding="utf-8") as f:
        for line in fixed_lines:
            f.write(json.dumps(line, ensure_ascii=False) + "\n")
            
    print(f"Successfully repaired {len(fixed_lines)} training rows!")

if __name__ == "__main__":
    fix_data()
