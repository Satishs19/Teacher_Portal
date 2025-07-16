from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from .models import Teacher
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from functools import wraps

#custom decorator to check if teacher is logged in or else redirect to login page
def teacher_login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if 'teacher_id' not in request.session:
            return redirect('/')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

#render the login page
def landing(request):
    return render(request, 'login.html')

#checking for the login credentials
#and redirecting to the home page if successful
@csrf_protect
def login_check(request):
    if request.method == 'POST':
        if request.content_type == 'application/json':
            import json
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
        else:
            username = request.POST.get('username')
            password = request.POST.get('password')
        try:
            teacher = Teacher.objects.get(username=username)
            if check_password(password, teacher.password):
                request.session['teacher_id'] = teacher.username
                return JsonResponse({'status': 'success', 'redirect_url': '/home/'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid password'})
        except Teacher.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

#Log out the user securly
@csrf_protect
@teacher_login_required
def logout_user(request):
    request.session.flush() 
    return redirect('/') 
# <a href="{% url 'accounts:logout' %}">Logout</a>

