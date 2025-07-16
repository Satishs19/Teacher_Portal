// Call loadStudents when the page loads
window.onload = loadStudents;
function searchStudents() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#studentTable tbody tr");

  rows.forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();
    row.style.display = name.includes(input) ? "" : "none";
  });
}

function getCSRFToken() {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    if (cookie.trim().startsWith(name + '=')) {
      return cookie.trim().substring(name.length + 1);
    }
  }
  return null;
}

async function deleteRow(btn) {
  const row = btn.closest("tr");
  const studentId = row.getAttribute('data-id');
  //confirm deletion from user
  if (!confirm("Are you sure you want to delete this student?")) return;

  const response = await fetch(`/delete/${studentId}/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRFToken()
    }
  });

  const result = await response.json();
  if (result.message) {
    alert(result.message);
    loadStudents();
  } else {
    alert(result.error || "Delete failed");
  }
}

async function editRow(btn) {
  const row = btn.closest("tr");
  const studentId = row.getAttribute('data-id');
  const cells = row.querySelectorAll("td");

  // Replace cells with input fields
  for (let i = 0; i < cells.length - 1; i++) {
    const input = document.createElement("input");
    input.value = cells[i].textContent;
    cells[i].textContent = "";
    cells[i].appendChild(input);
  }

  btn.textContent = "Save";
  btn.onclick = async function () {
    // Get updated values
    const updatedName = cells[0].querySelector("input").value;
    const updatedSubject = cells[1].querySelector("input").value;
    const updatedMark = cells[2].querySelector("input").value;

    const check = validate_fields(updatedName, updatedSubject, updatedMark);
    if (check) {
    alert(check);
    return;
  }
    // Prepare form data
    const formData = new FormData();
    formData.append('name', updatedName);
    formData.append('subject', updatedSubject);
    formData.append('marks', updatedMark);

    // Send POST request to update_student endpoint
    const response = await fetch(`/update/${studentId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCSRFToken()
      },
      body: formData
    });

    const result = await response.json();
    if (result.message) {
      // Reload students to reflect changes
      alert(result.message);
      loadStudents();
    } else {
      alert(result.error || "Update failed");
    }
  };
}

function openModal() {
  document.getElementById("studentModal").style.display = "flex";
}
function closeModal() {
  document.getElementById("studentModal").style.display = "none";

  // Clear form inputs too (optional)
  document.getElementById("modalName").value = "";
  document.getElementById("modalSubject").value = "";
  document.getElementById("modalMark").value = "";
}

async function addStudent() {
  const name = document.getElementById("modalName").value;
  const subject = document.getElementById("modalSubject").value;
  const mark = document.getElementById("modalMark").value;

  const check = validate_fields(name, subject, mark);
  if (check) {
    alert(check);
    return;
  }


  const formData = new FormData();
  formData.append('name', name);
  formData.append('subject', subject); 
  formData.append('marks', mark); 

  const response = await fetch('/add_new/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRFToken()
    },
    body: formData
  });

  const result = await response.json();
  if (result.message) {
    alert(result.message);
    closeModal();
    loadStudents();
  } else {
    alert(result.error || "Add failed");
  }
}


async function loadStudents() {
  try {
    const response = await fetch('/student_list/');
    const data = await response.json();
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    data.students.forEach(student => {
      const row = document.createElement('tr');
      row.setAttribute('data-id', student.id); // Store student ID in row
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.subject || ''}</td>
        <td>${student.mark || ''}</td>
        <td class="actions">
          <button class="edit" onclick="editRow(this)">Edit</button>
          <button class="delete" onclick="deleteRow(this)">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Failed to load students:', error);
  }
}

function validate_fields(name,subject,mark) {
  // empty field check
  if (!name || !subject || !mark) {
    return "❌ fields cannot be empty.";
  }
  // Check if name or subject is only numbers
  if (!isNaN(name) || !isNaN(subject)) {
    return "❌ Name and Subject cannot be numbers only.";
  }
  // Letters + spaces only validation no numbers or special characters
  const validText = /^[a-zA-Z\s]+$/;
  if (!validText.test(name) || !validText.test(subject)) {
    return "❌ Name and Subject must contain only letters and spaces.";
  }
  if (isNaN(mark)) {
    return "❌ Marks must be a number.";
  }

  return null;
}