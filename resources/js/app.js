'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const btnNewList = document.querySelector('.btn-new-list');
  const newList = document.querySelector('.new-list');
  const createList = document.querySelector('.create-list');

  // const request = window.ajax({ baseUrl: 'https://todo-sinatra-app.herokuapp.com' });
  const request = window.ajax({ baseUrl: 'http://127.0.0.1:9393' });

  const renderList = (list) => {
    const lists = document.querySelector('.lists');

    let content = `<div class="title" id="list-title-${list.id}" style="color: #${list.color}">${list.name}</div>`;
    content += `<div class="content">`;
    content += `<div class="tasks" id="tasks-${list.id}">`;

    list.tasks.map((task) => {
      content += `<div class="task" id="task-${task.id}">`;
      content += `<a id="btn-delete-task-${task.id}" class="btn-delete-task"></a>`;
      content += `<span>${task.name}</span>`;
      content += `</div>`;
    });

    content += `</div>`;
    content += `<div id="list-form-${list.id}" class="form">`;
    content += `<a class="btn btn-add-task">+</a>`;
    content += `</div>`;

    content += `</div>`;
    content += `</div>`;

    let div = document.createElement('div');
    div.innerHTML = content;
    div.id = `list-${list.id}`;
    div.classList.add('list');
    // div.style = `box-shadow: 0px 6px 23px -3px #${list.color}, 0px -6px 23px -3px #${list.color}`;
    lists.appendChild(div);

    let listTitle = document.querySelector(`#list-title-${list.id}`);
    listTitle.addEventListener('click', (e) => {
      let currentList = e.target.parentNode;
      let lists = e.target.parentNode.parentNode.querySelectorAll('.list');

      if (currentList.classList.contains('active')) {
        currentList.classList.remove('active');

        Array.from(lists).forEach(function(list) {
          list.classList.remove('inactive');
        });
      } else {
        currentList.classList.add('active');

        Array.from(lists).forEach(function(list) {
          if (currentList.id !== list.id) {
            list.classList.add('inactive');
          }
        });
      }
    });

    let form = document.createElement('form');
    form.innerHTML = `<input type="text" class="task-name">`;
    form.innerHTML += `<input type="hidden" class="list-id" value="${list.id}">`;
    form.innerHTML += `<input type="submit" class="hidden" />`;
    form.id = `list-${list.id}`;
    form.classList.add('new-task');

    let formHolder = document.querySelector(`#list-form-${list.id}`);
    formHolder.appendChild(form);
    form.addEventListener('submit', (e) => {
      const name = form.querySelector('.task-name').value;
      const listId = form.querySelector('.list-id').value;
      const params = { name: name, list_id: listId };

      form.reset();

      request.post('/tasks', params).then((response) => {

        let tasks = document.querySelector(`#tasks-${listId}`);
        tasks.innerHTML += `<div class="task" id="task-${response.id}"><a id="btn-delete-task-${response.id}" class="btn-delete-task"></a><span>${response.name}</span></div>`;

        let btnDeleteTask = document.querySelector(`#btn-delete-task-${response.id}`);
        btnDeleteTask.addEventListener('click', (e) => {
          deleteTask(response.id);
          e.preventDefault();
        });

      }).catch((response) => {

        let errors = `Ops: \n`;
        response.forEach(function (error) {
          errors += `\n- ${error}`;
        });

        window.alert(errors);
      });

      e.preventDefault();
    });

    list.tasks.map((task) => {
      let btnDeleteTask = document.querySelector(`#btn-delete-task-${task.id}`);
      btnDeleteTask.addEventListener('click', (e) => {
        deleteTask(task.id);
        e.preventDefault();
      });
    });
  };

  request.get('/lists').then((response) => {
    response.map((list) => renderList(list));
  });

  createList.addEventListener('click', () => {
    const name = document.querySelector('.list-name').value;
    const color = document.querySelector('.list-color').value;
    const params = { name: name, color: color };

    request.post('/lists', params).then((response) => {

      renderList(response);
      newList.classList.toggle('active');
      document.querySelector('.list-name').value = '';

    }).catch((response) => {

      let errors = `Ops: \n`;
      response.forEach(function (error) {
        errors += `\n- ${error}`;
      });

      window.alert(errors);
    });

    return false;
  });

  const deleteTask = (id) => {
    if (window.confirm('Are you sure?')) {
      let task = document.querySelector(`#task-${id}`);
      task.parentNode.removeChild(task);
      request.delete(`/tasks/${id}`);
    }
  };

  btnNewList.addEventListener('click', () => {
    newList.classList.toggle('active');
  });

});
