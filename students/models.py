from django.db import models

#student table with name, subject and marks
class Student(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    marks = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.subject}): {self.marks} marks"


