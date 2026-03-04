from gradio_client import Client

try:
    client = Client("resembleai/chatterbox")
    client.view_api()
except Exception as e:
    print(e)
