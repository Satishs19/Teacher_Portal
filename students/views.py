from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from .models import Student
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required
from accounts.models import Teacher
from functools import wraps

#custom decorator to check if teacher is logged in or else redirect to login page
def teacher_login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if 'teacher_id' not in request.session:
            return redirect('/')
        return view_func(request, *args, **kwargs)
    return _wrapped_view


# On successful login render home page
@teacher_login_required
def home(request):
    username = request.session.get('teacher_id')
    teacher = Teacher.objects.get(username=username)
    return render(request, 'home.html',{'username': teacher.name})

# View to get list all students
@csrf_protect
@teacher_login_required
def student_list(request):
    if request.method == 'GET':
        students = Student.objects.all()
        student_data = []
        for student in students:
            student_data.append({
                'id': student.id,
                'name': student.name,
                'subject': student.subject,
                'mark': student.marks,
            })
        return JsonResponse({'students': student_data})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# View to update student details
@csrf_protect
@teacher_login_required
def update_student(request, student_id):
    if request.method == 'POST':
        try:
            student = Student.objects.get(id=student_id)
            student.name = request.POST.get('name', student.name)
            student.subject = request.POST.get('subject', student.subject)
            student.marks = request.POST.get('marks', student.marks)
            student.save()
            return JsonResponse({'message': 'Student updated successfully'})
        except Student.DoesNotExist:
            return JsonResponse({'error': 'Student not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# View to delete a student
@csrf_protect
@teacher_login_required
def delete_student(request, student_id):
    if request.method == 'POST':
        try:
            student = Student.objects.get(id=student_id)
            student.delete()
            return JsonResponse({'message': 'Student deleted successfully'})
        except Student.DoesNotExist:
            return JsonResponse({'error': 'Student not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)


# View to add a new student
@csrf_protect
@teacher_login_required
def add_student(request):
    if request.method == 'POST':
        name = request.POST.get('name').strip()
        subject = request.POST.get('subject').strip()
        marks = request.POST.get('marks').strip()
        if name and subject and marks:
            marks = int(marks)  # Convert marks to integer if received as string

            # Check if a student with same name + subject exists
            try:
                student = Student.objects.get(name=name, subject=subject)
                student.marks += marks
                student.save()
                return JsonResponse({'message': 'Student marks updated successfully'})
            except Student.DoesNotExist:
                student = Student(name=name, subject=subject, marks=marks)
                student.save()
                return JsonResponse({'message': 'New student added successfully'})
        else:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

