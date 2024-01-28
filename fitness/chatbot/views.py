# myapp/views.py

from django.shortcuts import render
from django.http import JsonResponse
import requests
import json

def index(request):
    if request.method == 'POST':
        user_input = request.POST.get('user_input', '')


        prompt = f"User: {user_input}\nAssistant:"

        # Send user input to OpenAI API
        response = requests.post(
            'https://api.openai.com/v1/engines/gpt-3.5-turbo-1106/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': 'Bearer OPENAPIkey',
            },
            json={
                'prompt': user_input,
                'max_tokens': 150,
            }
        )

         
        try:
            response_data = response.json()
            model_response = response_data['choices'][0]['text']
        except KeyError:
            # Handle the case where the response structure does not match expectations
            model_response = 'Error: Unexpected response structure.'
            print(f"Unexpected response structure: {response.text}")
        except json.JSONDecodeError:
            # Handle JSON decoding errors
            model_response = 'Error: Unable to decode JSON response.'
            print(f"Unable to decode JSON response: {response.text}")
        except Exception as e:
            # Handle other unexpected errors
            model_response = f'Error: {str(e)}'
            print(f"Unexpected error: {str(e)}")
        
        return JsonResponse({'response': model_response})

    return render(request, 'chatbot/index.html')


def dashboar(request):
    return render(request, 'Dashboard/index.html')


def chatbot(request):
    return render(request,"chatbot\index.html")

