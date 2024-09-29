const nameInput = document.querySelector("#name");
const lastNameInput = document.querySelector("#lastName");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#email");
const descriptionInput = document.querySelector("#description");

const form = document.querySelector("#form");
const containerCita = document.querySelector(".contenedor-citas");
const btnRegistrar = document.querySelector('#form input[type="submit"]');

let editando = false;

//Objeto para llenar el formulario
const objectRegister = {
  id: agregarID(),
  name: "",
  lastName: "",
  phone: "",
  email: "",
  description: "",
};

//EventListeners
nameInput.addEventListener("input", dataObject);
lastNameInput.addEventListener("input", dataObject);
phoneInput.addEventListener("input", dataObject);
emailInput.addEventListener("input", dataObject);
descriptionInput.addEventListener("input", dataObject);
form.addEventListener("submit", submitForm);

//Fell all fields the objectregister
function dataObject(e) {
  objectRegister[e.target.id] = e.target.value;
}

//CLASS NOTIFICATION
class Notification {
  constructor({ texto, tipo }) {
    (this.texto = texto), (this.tipo = tipo);
    this.mostrar();
  }

  mostrar() {
    const alert = document.createElement("DIV");
    alert.classList.add(
      "p-3",
      "text-uppercase",
      "text-white",
      "text-center",
      "alert"
    );

    const alertPrevius = document.querySelector(".alert");
    alertPrevius?.remove();

    this.tipo == "Error"
      ? alert.classList.add("bg-danger")
      : alert.classList.add("bg-success");

    alert.textContent = this.texto;
    form.appendChild(alert);

    //Remove alert in interval time
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

class AdminCitas {
  constructor() {
    this.citas = [];
    this.mostrar();
  }

  agregar(cita) {
    this.citas = [...this.citas, cita];
    this.mostrar();
  }

  editar(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
    this.mostrar();
  }
  eliminar(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
    this.mostrar();
  }

  mostrar() {
    while (containerCita.firstChild) {
      containerCita.removeChild(containerCita.firstChild);
    }

    if (this.citas.length === 0) {
      containerCita.innerHTML = `<p class="text-center">No hay pacientes registrados</p>`;
      return;
    }

    this.citas.forEach((cita) => {
      const { name } = cita;
      const divCita = document.createElement("Div");
      divCita.classList.add("p-3", "border", "border-2", "rounded", "mb-2");

      const fieldName = document.createElement("P");
      fieldName.classList.add("mb-1");
      fieldName.innerHTML = `<strong class='text-uppercase'>Nombre: </strong>${cita.name}`;

      const fieldLastName = document.createElement("P");
      fieldLastName.classList.add("mb-1");
      fieldLastName.innerHTML = `<strong class='text-uppercase'>Apellidos: </strong>${cita.lastName}`;

      const fieldPhone = document.createElement("P");
      fieldPhone.classList.add("mb-1");
      fieldPhone.innerHTML = `<strong class='text-uppercase'>Telf: </strong>${cita.phone}`;

      const fieldEmail = document.createElement("P");
      fieldEmail.classList.add("mb-1");
      fieldEmail.innerHTML = `<strong class='text-uppercase'>Email: </strong>${cita.email}`;

      const fieldDescription = document.createElement("P");
      fieldDescription.classList.add("mb-1");
      fieldDescription.innerHTML = `<strong class='text-uppercase'>Descripcion: </strong>${cita.description}`;

      //Buttons
      const btnEditar = document.createElement("button");
      btnEditar.classList.add(
        "btn",
        "btn-warning",
        "btn-lg",
        "fw-bold",
        "text-uppercase",
        "text-white"
      );
      btnEditar.innerHTML = ` <i class="bi bi-pen-fill">Editar</i>`;

      //adding click Edit
      const clone = { ...cita };
      btnEditar.onclick = () => editarRegistro(clone);

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add(
        "btn",
        "btn-danger",
        "btn-lg",
        "fw-bold",
        "text-uppercase",
        "text-black",
        "text-white"
      );
      btnEliminar.innerHTML = ` <i class="bi bi-x-circle-fill">Eliminar</i>`;
      btnEliminar.onclick = () => this.eliminar(cita.id);

      const divBotones = document.createElement("DIV");
      divBotones.classList.add(
        "w-100",
        "d-flex",
        "justify-content-between",
        "mt-3"
      );
      divBotones.appendChild(btnEditar);
      divBotones.appendChild(btnEliminar);

      //Inyectar parrafo al div
      divCita.appendChild(fieldName);
      divCita.appendChild(fieldLastName);
      divCita.appendChild(fieldPhone);
      divCita.appendChild(fieldEmail);
      divCita.appendChild(fieldDescription);
      divCita.appendChild(divBotones);

      containerCita.appendChild(divCita);
    });
  }
}

//Instanciar clase citas
const adminCitas = new AdminCitas();

function submitForm(e) {
  e.preventDefault(); // r -> Register = recorre cada registro
  //validar si el objeto tiene campos vacios
  if (Object.values(objectRegister).some((r) => r.trim() === "")) {
    var notificacion = new Notification({
      texto: "Todos los campos son requeridos",
      tipo: "Error",
    });
    return;
  }

  if (editando) {
    adminCitas.editar({ ...objectRegister });
    var notificacion = new Notification({
      texto: "Paciente actualizado",
      tipo: "exito",
    });
  } else {
    adminCitas.agregar({ ...objectRegister });
    var notificacion = new Notification({
      texto: "Paciente registrado correctamente",
      tipo: "exito",
    });
  }

  form.reset();
  cleanFielfs();
  editando = false;
  btnRegistrar.value = "Registrar";
}

//Editar registro
function editarRegistro(cita) {
  Object.assign(objectRegister, cita);
  nameInput.value = cita.name;
  lastNameInput.value = cita.lastName;
  phoneInput.value = cita.phone;
  emailInput.value = cita.email;
  descriptionInput.value = cita.description;

  btnRegistrar.value = "Guardar cambios";

  editando = true;
}

//Agaregando un ID unico a cada cita
function agregarID() {
  return Math.random().toString(36).substring(2) + Date.now();
}

//Resetear formulario depues d eenviar cita
function cleanFielfs() {
  //objectRegister.name = "";
  Object.assign(objectRegister, {
    id: agregarID(),
    name: "",
    lastName: "",
    phone: "",
    email: "",
    description: "",
  });
}
