const API = {
  doctors: "/doctors",
  patients: "/patients",
  appointments: "/appointments"
};


/* =========================
   BASIC HELPERS
========================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


const showToast = (message) => {

  const toast = $("#toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
};


const showMessage = (selector, message = "") => {

  $(selector).textContent = message;
};


/* =========================
   API REQUEST
========================= */

const apiRequest = async (url, options = {}) => {

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },

    ...options
  });


  const data = await response.json().catch(() => ({}));


  if (!response.ok) {

    const validationErrors =
      data.errors
        ?.map(error => error.message)
        .join(", ");


    throw new Error(
      validationErrors ||
      data.message ||
      "Request failed"
    );
  }


  return data;
};


/* =========================
   DASHBOARD
========================= */

const loadDashboard = async () => {

  const [
    doctors,
    patients,
    appointments,
    scheduledAppointments
  ] = await Promise.all([

    apiRequest(API.doctors),

    apiRequest(API.patients),

    apiRequest(API.appointments),

    apiRequest(
      `${API.appointments}?status=Scheduled`
    )

  ]);


  $("#doctorCount").textContent =
    doctors.length;


  $("#patientCount").textContent =
    patients.length;


  $("#appointmentCount").textContent =
    appointments.length;


  $("#scheduledCount").textContent =
    scheduledAppointments.length;
};


/* =========================
   DOCTORS
========================= */

const renderDoctors = (doctors) => {

  const grid = $("#doctorsGrid");


  if (!doctors.length) {

    grid.innerHTML =
      `<div class="empty">
        No doctors found.
      </div>`;

    return;
  }


  grid.innerHTML = doctors.map(doctor => `

    <article class="doctor-card">

      <div class="card-top">

        <div>

          <h3 class="card-title">
            ${doctor.name}
          </h3>

          <div class="card-subtitle">
            ${doctor.specialization}
          </div>

        </div>


        <div class="avatar">
          ${doctor.name.charAt(0).toUpperCase()}
        </div>

      </div>


      <div class="info-list">

        <div class="info-row">
          <span>Phone</span>
          <b>${doctor.phone}</b>
        </div>

        <div class="info-row">
          <span>Experience</span>
          <b>${doctor.experience} years</b>
        </div>

      </div>


      <div class="card-actions">

        <button
          class="ghost-btn small-btn"
          data-edit-doctor="${doctor._id}">
          Edit
        </button>

        <button
          class="danger-btn small-btn"
          data-delete-doctor="${doctor._id}">
          Delete
        </button>

      </div>

    </article>

  `).join("");
};


const loadDoctors = async () => {

  try {

    const name =
      $("#doctorSearch").value.trim();

    const specialization =
      $("#doctorSpecialization").value.trim();


    const params =
      new URLSearchParams();


    if (name) {
      params.set("name", name);
    }


    if (specialization) {
      params.set(
        "specialization",
        specialization
      );
    }


    const url =
      params.toString()
        ? `${API.doctors}?${params}`
        : API.doctors;


    const doctors =
      await apiRequest(url);


    renderDoctors(doctors);

    showMessage("#doctorMessage");

  }

  catch (error) {

    showMessage(
      "#doctorMessage",
      error.message
    );

  }

};


/* =========================
   PATIENTS
========================= */

const renderPatients = (patients) => {

  const grid = $("#patientsGrid");


  if (!patients.length) {

    grid.innerHTML =
      `<div class="empty">
        No patients found.
      </div>`;

    return;
  }


  grid.innerHTML = patients.map(patient => `

    <article class="patient-card">

      <div class="card-top">

        <div>

          <h3 class="card-title">
            ${patient.name}
          </h3>

          <div class="card-subtitle">
            ${patient.gender}
          </div>

        </div>


        <div class="avatar">
          ${patient.name.charAt(0).toUpperCase()}
        </div>

      </div>


      <div class="info-list">

        <div class="info-row">
          <span>Phone</span>
          <b>${patient.phone}</b>
        </div>

        <div class="info-row">
          <span>Age</span>
          <b>${patient.age}</b>
        </div>

        <div class="info-row">
          <span>Gender</span>
          <b>${patient.gender}</b>
        </div>

      </div>


      <div class="card-actions">

        <button
          class="ghost-btn small-btn"
          data-edit-patient="${patient._id}">
          Edit
        </button>

        <button
          class="danger-btn small-btn"
          data-delete-patient="${patient._id}">
          Delete
        </button>

      </div>

    </article>

  `).join("");
};


const loadPatients = async () => {

  try {

    const name =
      $("#patientSearch").value.trim();

    const gender =
      $("#patientGender").value;

    const age =
      $("#patientAge").value;


    const params =
      new URLSearchParams();


    if (name) {
      params.set("name", name);
    }


    if (gender) {
      params.set("gender", gender);
    }


    if (age) {
      params.set("age", age);
    }


    const url =
      params.toString()
        ? `${API.patients}?${params}`
        : API.patients;


    const patients =
      await apiRequest(url);


    renderPatients(patients);

    showMessage("#patientMessage");

  }

  catch (error) {

    showMessage(
      "#patientMessage",
      error.message
    );

  }

};


/* =========================
   APPOINTMENTS
========================= */

const renderAppointments = (appointments) => {

  const container =
    $("#appointmentsTable");


  if (!appointments.length) {

    container.innerHTML =
      `<div class="empty">
        No appointments found.
      </div>`;

    return;
  }


  container.innerHTML = `

    <table>

      <thead>

        <tr>

          <th>Doctor</th>

          <th>Patient</th>

          <th>Date</th>

          <th>Time</th>

          <th>Status</th>

          <th>Notes</th>

          <th>Actions</th>

        </tr>

      </thead>


      <tbody>

        ${appointments.map(appointment => `

          <tr>

            <td>

              <b>
                ${appointment.doctor?.name || "—"}
              </b>

              <br>

              <small>
                ${appointment.doctor?.specialization || ""}
              </small>

            </td>


            <td>

              <b>
                ${appointment.patient?.name || "—"}
              </b>

              <br>

              <small>
                ${appointment.patient?.phone || ""}
              </small>

            </td>


            <td>
              ${new Date(
                appointment.date
              ).toLocaleDateString()}
            </td>


            <td>
              ${appointment.time}
            </td>


            <td>

              <span
                class="badge ${appointment.status.toLowerCase()}">

                ${appointment.status}

              </span>

            </td>


            <td>
              ${appointment.notes || "—"}
            </td>


            <td>

              <button
                class="ghost-btn small-btn"
                data-edit-appointment="${appointment._id}">
                Edit
              </button>

              <button
                class="danger-btn small-btn"
                data-delete-appointment="${appointment._id}">
                Delete
              </button>

            </td>

          </tr>

        `).join("")}

      </tbody>

    </table>

  `;
};


const loadAppointments = async () => {

  try {

    const status =
      $("#appointmentStatus").value;


    const url = status
      ? `${API.appointments}?status=${encodeURIComponent(status)}`
      : API.appointments;


    const appointments =
      await apiRequest(url);


    renderAppointments(appointments);

    showMessage("#appointmentMessage");

  }

  catch (error) {

    showMessage(
      "#appointmentMessage",
      error.message
    );

  }

};


/* =========================
   MODAL
========================= */

const openModal = (
  title,
  eyebrow,
  formHTML,
  submitText,
  submitHandler
) => {

  $("#modalTitle").textContent =
    title;


  $("#modalEyebrow").textContent =
    eyebrow;


  $("#entityForm").innerHTML = `

    ${formHTML}

    <div class="form-actions">

      <button
        type="button"
        class="ghost-btn"
        id="cancelForm">
        Cancel
      </button>

      <button
        type="submit"
        class="primary-btn">
        ${submitText}
      </button>

    </div>

  `;


  $("#modalBackdrop")
    .classList
    .add("open");


  $("#cancelForm").onclick = () => {

    $("#modalBackdrop")
      .classList
      .remove("open");

  };


  $("#entityForm").onsubmit =
    submitHandler;
};


/* =========================
   DOCTOR FORM
========================= */

const doctorForm = (doctor = {}) => `

  <div class="form-grid">

    <div class="form-field full">

      <label>
        Name
      </label>

      <input
        name="name"
        required
        value="${doctor.name || ""}"
      />

    </div>


    <div class="form-field">

      <label>
        Specialization
      </label>

      <input
        name="specialization"
        required
        value="${doctor.specialization || ""}"
      />

    </div>


    <div class="form-field">

      <label>
        Phone
      </label>

      <input
        name="phone"
        required
        value="${doctor.phone || ""}"
      />

    </div>


    <div class="form-field">

      <label>
        Experience
      </label>

      <input
        name="experience"
        type="number"
        min="0"
        required
        value="${doctor.experience ?? ""}"
      />

    </div>

  </div>

`;


/* =========================
   PATIENT FORM
========================= */

const patientForm = (patient = {}) => `

  <div class="form-grid">

    <div class="form-field full">

      <label>
        Name
      </label>

      <input
        name="name"
        required
        value="${patient.name || ""}"
      />

    </div>


    <div class="form-field">

      <label>
        Phone
      </label>

      <input
        name="phone"
        required
        value="${patient.phone || ""}"
      />

    </div>


    <div class="form-field">

      <label>
        Age
      </label>

      <input
        name="age"
        type="number"
        min="0"
        required
        value="${patient.age ?? ""}"
      />

    </div>


    <div class="form-field full">

      <label>
        Gender
      </label>

      <select name="gender" required>

        <option value="">
          Select gender
        </option>

        <option
          value="Female"
          ${patient.gender === "Female" ? "selected" : ""}>
          Female
        </option>

        <option
          value="Male"
          ${patient.gender === "Male" ? "selected" : ""}>
          Male
        </option>

      </select>

    </div>

  </div>

`;


/* =========================
   APPOINTMENT FORM
========================= */

const appointmentForm = async (
  appointment = {}
) => {

  const [
    doctors,
    patients
  ] = await Promise.all([

    apiRequest(API.doctors),

    apiRequest(API.patients)

  ]);


  const doctorId =
    appointment.doctor?._id ||
    appointment.doctor ||
    "";


  const patientId =
    appointment.patient?._id ||
    appointment.patient ||
    "";


  openModal(

    appointment._id
      ? "Edit Appointment"
      : "New Appointment",

    "APPOINTMENT",


    `

      <div class="form-grid">

        <div class="form-field full">

          <label>
            Doctor
          </label>

          <select
            name="doctor"
            required>

            <option value="">
              Select doctor
            </option>

            ${doctors.map(doctor => `

              <option
                value="${doctor._id}"
                ${doctor._id === doctorId
                  ? "selected"
                  : ""}>

                ${doctor.name}
                —
                ${doctor.specialization}

              </option>

            `).join("")}

          </select>

        </div>


        <div class="form-field full">

          <label>
            Patient
          </label>

          <select
            name="patient"
            required>

            <option value="">
              Select patient
            </option>

            ${patients.map(patient => `

              <option
                value="${patient._id}"
                ${patient._id === patientId
                  ? "selected"
                  : ""}>

                ${patient.name}
                —
                ${patient.phone}

              </option>

            `).join("")}

          </select>

        </div>


        <div class="form-field">

          <label>
            Date
          </label>

          <input
            name="date"
            type="date"
            required
            value="${
              appointment.date
                ? appointment.date.slice(0, 10)
                : ""
            }"
          />

        </div>


        <div class="form-field">

          <label>
            Time
          </label>

          <input
            name="time"
            type="time"
            required
            value="${appointment.time || ""}"
          />

        </div>


        <div class="form-field">

          <label>
            Status
          </label>

          <select name="status">

            <option
              value="Scheduled"
              ${
                appointment.status === "Scheduled" ||
                !appointment.status
                  ? "selected"
                  : ""
              }>
              Scheduled
            </option>

            <option
              value="Completed"
              ${
                appointment.status === "Completed"
                  ? "selected"
                  : ""
              }>
              Completed
            </option>

            <option
              value="Cancelled"
              ${
                appointment.status === "Cancelled"
                  ? "selected"
                  : ""
              }>
              Cancelled
            </option>

          </select>

        </div>


        <div class="form-field">

          <label>
            Notes
          </label>

          <textarea
            name="notes"
          >${appointment.notes || ""}</textarea>

        </div>

      </div>

    `,

    appointment._id
      ? "Save Changes"
      : "Book Appointment",


    async (event) => {

      event.preventDefault();


      const data =
        Object.fromEntries(
          new FormData(event.target)
        );


      try {

        await apiRequest(

          appointment._id
            ? `${API.appointments}/${appointment._id}`
            : API.appointments,

          {

            method:
              appointment._id
                ? "PUT"
                : "POST",

            body:
              JSON.stringify(data)

          }

        );


        $("#modalBackdrop")
          .classList
          .remove("open");


        showToast(
          appointment._id
            ? "Appointment updated"
            : "Appointment created"
        );


        await loadAppointments();

        await loadDashboard();

      }

      catch (error) {

        alert(error.message);

      }

    }

  );

};


/* =========================
   ADD DOCTOR
========================= */

$("#addDoctorBtn").onclick = () => {

  openModal(

    "Add Doctor",

    "DOCTOR",

    doctorForm(),

    "Create Doctor",

    async (event) => {

      event.preventDefault();


      const data =
        Object.fromEntries(
          new FormData(event.target)
        );


      data.experience =
        Number(data.experience);


      try {

        await apiRequest(

          API.doctors,

          {

            method: "POST",

            body:
              JSON.stringify(data)

          }

        );


        $("#modalBackdrop")
          .classList
          .remove("open");


        showToast(
          "Doctor created"
        );


        await loadDoctors();

        await loadDashboard();

      }

      catch (error) {

        alert(error.message);

      }

    }

  );

};


/* =========================
   ADD PATIENT
========================= */

$("#addPatientBtn").onclick = () => {

  openModal(

    "Add Patient",

    "PATIENT",

    patientForm(),

    "Create Patient",

    async (event) => {

      event.preventDefault();


      const data =
        Object.fromEntries(
          new FormData(event.target)
        );


      data.age =
        Number(data.age);


      try {

        await apiRequest(

          API.patients,

          {

            method: "POST",

            body:
              JSON.stringify(data)

          }

        );


        $("#modalBackdrop")
          .classList
          .remove("open");


        showToast(
          "Patient created"
        );


        await loadPatients();

        await loadDashboard();

      }

      catch (error) {

        alert(error.message);

      }

    }

  );

};


/* =========================
   ADD APPOINTMENT
========================= */

$("#addAppointmentBtn").onclick =
  () => appointmentForm();


/* =========================
   SEARCH / FILTER
========================= */

$("#doctorSearchBtn").onclick =
  loadDoctors;


$("#doctorResetBtn").onclick = () => {

  $("#doctorSearch").value = "";

  $("#doctorSpecialization").value = "";

  loadDoctors();

};


$("#patientSearchBtn").onclick =
  loadPatients;


$("#patientResetBtn").onclick = () => {

  $("#patientSearch").value = "";

  $("#patientGender").value = "";

  $("#patientAge").value = "";

  loadPatients();

};


$("#appointmentFilterBtn").onclick =
  loadAppointments;


$("#appointmentResetBtn").onclick = () => {

  $("#appointmentStatus").value = "";

  loadAppointments();

};


/* =========================
   EDIT / DELETE
========================= */

document.addEventListener(
  "click",
  async (event) => {

    const doctorEdit =
      event.target.dataset.editDoctor;


    const doctorDelete =
      event.target.dataset.deleteDoctor;


    const patientEdit =
      event.target.dataset.editPatient;


    const patientDelete =
      event.target.dataset.deletePatient;


    const appointmentEdit =
      event.target.dataset.editAppointment;


    const appointmentDelete =
      event.target.dataset.deleteAppointment;


    /* ---------- DOCTOR EDIT ---------- */

    if (doctorEdit) {

      const doctor =
        await apiRequest(
          `${API.doctors}/${doctorEdit}`
        );


      openModal(

        "Edit Doctor",

        "DOCTOR",

        doctorForm(doctor),

        "Save Changes",

        async (event) => {

          event.preventDefault();


          const data =
            Object.fromEntries(
              new FormData(event.target)
            );


          data.experience =
            Number(data.experience);


          try {

            await apiRequest(

              `${API.doctors}/${doctorEdit}`,

              {

                method: "PUT",

                body:
                  JSON.stringify(data)

              }

            );


            $("#modalBackdrop")
              .classList
              .remove("open");


            showToast(
              "Doctor updated"
            );


            await loadDoctors();

            await loadDashboard();

          }

          catch (error) {

            alert(error.message);

          }

        }

      );

    }


    /* ---------- DOCTOR DELETE ---------- */

    if (
      doctorDelete &&
      confirm("Delete this doctor?")
    ) {

      try {

        await apiRequest(

          `${API.doctors}/${doctorDelete}`,

          {
            method: "DELETE"
          }

        );


        showToast(
          "Doctor deleted"
        );


        await loadDoctors();

        await loadDashboard();

      }

      catch (error) {

        alert(error.message);

      }

    }


    /* ---------- PATIENT EDIT ---------- */

    if (patientEdit) {

      const patient =
        await apiRequest(
          `${API.patients}/${patientEdit}`
        );


      openModal(

        "Edit Patient",

        "PATIENT",

        patientForm(patient),

        "Save Changes",

        async (event) => {

          event.preventDefault();


          const data =
            Object.fromEntries(
              new FormData(event.target)
            );


          data.age =
            Number(data.age);


          try {

            await apiRequest(

              `${API.patients}/${patientEdit}`,

              {

                method: "PUT",

                body:
                  JSON.stringify(data)

              }

            );


            $("#modalBackdrop")
              .classList
              .remove("open");


            showToast(
              "Patient updated"
            );


            await loadPatients();

            await loadDashboard();

          }

          catch (error) {

            alert(error.message);

          }

        }

      );

    }


    /* ---------- PATIENT DELETE ---------- */

    if (
      patientDelete &&
      confirm("Delete this patient?")
    ) {

      try {

        await apiRequest(

          `${API.patients}/${patientDelete}`,

          {
            method: "DELETE"
          }

        );


        showToast(
          "Patient deleted"
        );


        await loadPatients();

        await loadDashboard();

      }

      catch (error) {

        alert(error.message);

      }

    }


    /* ---------- APPOINTMENT EDIT ---------- */

    if (appointmentEdit) {

      const appointment =
        await apiRequest(
          `${API.appointments}/${appointmentEdit}`
        );


      await appointmentForm(
        appointment
      );

    }


    /* ---------- APPOINTMENT DELETE ---------- */

    if (
      appointmentDelete &&
      confirm("Delete this appointment?")
    ) {

      try {

        await apiRequest(

          `${API.appointments}/${appointmentDelete}`,

          {
            method: "DELETE"
          }

        );


        showToast(
          "Appointment deleted"
        );


        await loadAppointments();

        await loadDashboard();

      }

      catch (error) {

        alert(error.message);

      }

    }

  }
);


/* =========================
   NAVIGATION
========================= */

$$(".nav-btn").forEach(button => {

  button.onclick = () => {

    $$(".nav-btn")
      .forEach(btn =>
        btn.classList.remove("active")
      );


    $$(".section")
      .forEach(section =>
        section.classList.remove("active")
      );


    button.classList.add("active");


    $(`#${button.dataset.section}`)
      .classList
      .add("active");


    $("#pageTitle").textContent =
      button.textContent;

  };

});


/* =========================
   DASHBOARD QUICK ACTIONS
========================= */

$$("[data-go]").forEach(button => {

  button.onclick = () => {

    const target =
      button.dataset.go;


    $(
      `.nav-btn[data-section="${target}"]`
    ).click();

  };

});


/* =========================
   CLOSE MODAL
========================= */

$("#closeModal").onclick = () => {

  $("#modalBackdrop")
    .classList
    .remove("open");

};


$("#modalBackdrop").onclick = (event) => {

  if (
    event.target.id ===
    "modalBackdrop"
  ) {

    $("#modalBackdrop")
      .classList
      .remove("open");

  }

};


/* =========================
   INITIAL LOAD
========================= */

Promise.all([

  loadDashboard(),

  loadDoctors(),

  loadPatients(),

  loadAppointments()

]).catch(error => {

  console.error(error);

});