from django.urls import path
from . import views
urlpatterns = [
    path('home/', views.home, name='home'),
    path('student_list/', views.student_list, name='student_list'),
    path('update/<int:student_id>/', views.update_student, name='update_student'),
    path('delete/<int:student_id>/', views.delete_student, name='delete_student'),
    path('add_new/', views.add_student, name='add_student'),
]