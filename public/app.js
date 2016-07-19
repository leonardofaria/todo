'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var btnNewList = document.querySelector('.btn-new-list');
  var newList = document.querySelector('.new-list');
  var createList = document.querySelector('.create-list');

  // const request = window.ajax({ baseUrl: 'https://todo-sinatra-app.herokuapp.com' });
  var request = window.ajax({ baseUrl: 'http://127.0.0.1:9393' });

  var renderList = function renderList(list) {
    var lists = document.querySelector('.lists');

    var content = '<div class="title" id="list-title-' + list.id + '" style="color: #' + list.color + '">' + list.name + '</div>';
    content += '<div class="content">';
    content += '<div class="tasks" id="tasks-' + list.id + '">';

    list.tasks.map(function (task) {
      content += '<div class="task" id="task-' + task.id + '">';
      content += '<a id="btn-delete-task-' + task.id + '" class="btn-delete-task"></a>';
      content += '<span>' + task.name + '</span>';
      content += '</div>';
    });

    content += '</div>';
    content += '<div id="list-form-' + list.id + '" class="form">';
    content += '<a class="btn btn-add-task">+</a>';
    content += '</div>';

    content += '</div>';
    content += '</div>';

    var div = document.createElement('div');
    div.innerHTML = content;
    div.id = 'list-' + list.id;
    div.classList.add('list');
    // div.style = `box-shadow: 0px 6px 23px -3px #${list.color}, 0px -6px 23px -3px #${list.color}`;
    lists.appendChild(div);

    var listTitle = document.querySelector('#list-title-' + list.id);
    listTitle.addEventListener('click', function (e) {
      var currentList = e.target.parentNode;
      var lists = e.target.parentNode.parentNode.querySelectorAll('.list');

      if (currentList.classList.contains('active')) {
        currentList.classList.remove('active');

        Array.from(lists).forEach(function (list) {
          list.classList.remove('inactive');
        });
      } else {
        currentList.classList.add('active');

        Array.from(lists).forEach(function (list) {
          if (currentList.id !== list.id) {
            list.classList.add('inactive');
          }
        });
      }
    });

    var form = document.createElement('form');
    form.innerHTML = '<input type="text" class="task-name">';
    form.innerHTML += '<input type="hidden" class="list-id" value="' + list.id + '">';
    form.innerHTML += '<input type="submit" class="hidden" />';
    form.id = 'list-' + list.id;
    form.classList.add('new-task');

    var formHolder = document.querySelector('#list-form-' + list.id);
    formHolder.appendChild(form);
    form.addEventListener('submit', function (e) {
      var name = form.querySelector('.task-name').value;
      var listId = form.querySelector('.list-id').value;
      var params = { name: name, list_id: listId };

      form.reset();

      request.post('/tasks', params).then(function (response) {

        var tasks = document.querySelector('#tasks-' + listId);
        tasks.innerHTML += '<div class="task" id="task-' + response.id + '"><a id="btn-delete-task-' + response.id + '" class="btn-delete-task"></a><span>' + response.name + '</span></div>';

        var btnDeleteTask = document.querySelector('#btn-delete-task-' + response.id);
        btnDeleteTask.addEventListener('click', function (e) {
          deleteTask(response.id);
          e.preventDefault();
        });
      }).catch(function (response) {

        var errors = 'Ops: \n';
        response.forEach(function (error) {
          errors += '\n- ' + error;
        });

        window.alert(errors);
      });

      e.preventDefault();
    });

    list.tasks.map(function (task) {
      var btnDeleteTask = document.querySelector('#btn-delete-task-' + task.id);
      btnDeleteTask.addEventListener('click', function (e) {
        deleteTask(task.id);
        e.preventDefault();
      });
    });
  };

  request.get('/lists').then(function (response) {
    response.map(function (list) {
      return renderList(list);
    });
  });

  createList.addEventListener('click', function () {
    var name = document.querySelector('.list-name').value;
    var color = document.querySelector('.list-color').value;
    var params = { name: name, color: color };

    request.post('/lists', params).then(function (response) {

      renderList(response);
      newList.classList.toggle('active');
      document.querySelector('.list-name').value = '';
    }).catch(function (response) {

      var errors = 'Ops: \n';
      response.forEach(function (error) {
        errors += '\n- ' + error;
      });

      window.alert(errors);
    });

    return false;
  });

  var deleteTask = function deleteTask(id) {
    if (window.confirm('Are you sure?')) {
      var task = document.querySelector('#task-' + id);
      task.parentNode.removeChild(task);
      request.delete('/tasks/' + id);
    }
  };

  btnNewList.addEventListener('click', function () {
    newList.classList.toggle('active');
  });
});
//# sourceMappingURL=app.js.map
