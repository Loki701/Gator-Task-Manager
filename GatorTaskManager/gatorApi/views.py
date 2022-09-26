from django.shortcuts import render,HttpResponse

# Create your views here.(important)
def Index(request):
    return HttpResponse("Its working")

