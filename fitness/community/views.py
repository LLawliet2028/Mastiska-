from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request,"community/index.html")



def article(request):
    return render(request,"community/article.html")

def home(request):
    return render(request, "Dashboard/index.html")

def doc_view(request):
    return render(request,"community/docinfo.html")

