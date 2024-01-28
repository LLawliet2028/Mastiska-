# forms.py
from django import forms

class UserRegistrationForm(forms.Form):
    username = forms.CharField(max_length=50, required=True)
    password = forms.CharField(max_length=50, widget=forms.PasswordInput, required=True)
