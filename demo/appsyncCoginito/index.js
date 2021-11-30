const AppSync = {
  "graphqlEndpoint": config.graphqlEndpoint,
  "apiKey": config.apiKey,
  "jwtToken": config.jwtToken
};

// 認証のタイプはx-api-keyやcognitoなどがある
// appsyncの設定によって組み合わせることも可能
const xApiKey = 'xApiKey';
const cognito = 'cognito';

// const authType = 'xApiKey';
const authType = cognito;

const exportErrorMessage = {
  tokenExpired: 'Tokenの有効期限が切れています'
};

(function ($) {
  const ajaxSetupData = {
    url: AppSync.graphqlEndpoint,
    type: 'POST',
    dataType: 'json',
    headers: {}
  };

  // 認証のタイプがxApiKeyであればrequest headersにX-Api-Keyを付与
  // 認証のタイプがxApiKeyであればrequest headersにAuthorizationを付与
  if (authType === xApiKey) {
    ajaxSetupData.headers['X-Api-Key'] = AppSync.apiKey;
  } else if (authType === cognito) {
    ajaxSetupData.headers['Authorization'] = AppSync.jwtToken;
  }

  $.ajaxSetup(ajaxSetupData);

  const getTodos = () => {
    // const param = JSON.stringify({
    //     'query': `{
    //         listUsers {
    //             id
    //             name
    //             todos {
    //                 id
    //                 content
    //             }
    //         }
    //     }`
    // });

    // query文はAWSのGUIのappsyncのクエリから取ってくると簡単
    const param = JSON.stringify({
      'query': `{
        listUsers {
          items {
            id
            name
            todos {
              content
              id
            }
          }
        }
      }`
    });

    $.ajax({
      data: param
    }).done(function (data, textStatus, jqXHR) {
      const $todoList = $('#todoList tbody');
      let tr = '';
      $todoList.empty();

      for (let i = 0; i < data.data.listUsers.items.length; i++) {
        const user = data.data.listUsers.items[i];
        tr += `
                    <th><div>${user.name}</div></th>
                    <td>
                        <ul data-role="listview">`;

        for (let todo of user.todos) {
          tr += `
                        <li data-todoid="${todo.id}">
                            <div>${todo.content}</div>
                            <button class="button alert mini ml-auto"><span class="mif-minus"></span></button>
                        </li>`;
        }

        tr += `
                            <li data-userid="${user.id}">
                                <input type="text">
                                <button class="button primary mini ml-auto"><span class="mif-plus"></span></button>
                            </li>
                        </ul>
                    </td>`;

        if (i % 4 === 3) {
          $todoList.append(`<tr>${tr}</tr>`);
          tr = '';
        }
      }

      if (!!tr) {
        $todoList.append(`<tr>${tr}</tr>`);
      }

    }).fail(function (jqXHR, textStatus, errorThrown) {
      // errorMessageがToken has expiredは有効期限切れ
      const errorType = jqXHR.responseJSON.errors[0].errorType;
      const errorMessage = jqXHR.responseJSON.errors[0].message;

      if (errorMessage === 'Token has expired.') {
        $('#errorMessage').removeClass('dis-n').text(exportErrorMessage.tokenExpired);
      }

      console.log('request error: ', errorType, errorMessage);
      console.log(jqXHR, textStatus, errorThrown);
    });
  };

  const createUser = userName => {
    const param = JSON.stringify({
      'query': `mutation {
        createUser(name: "${userName}") {
          id
        }
      }`
    });

    $.ajax({
      data: param
    }).done(function () {
      getTodos();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR, textStatus, errorThrown);
    });
  };

  const createTodo = (userId, content) => {
    const param = JSON.stringify({
      'query': `mutation {
        createTodo(userId: "${userId}" ,content: "${content}") {
          id
        }
      }`
    });

    $.ajax({
      data: param
    }).done(function () {
      getTodos();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR, textStatus, errorThrown);
    });
  };

  const deleteTodo = todoId => {
    const param = JSON.stringify({
      'query': `mutation {
        deleteTodo(id: "${todoId}") {
          id
        }
      }`
    });

    $.ajax({
      data: param
    }).done(function () {
      getTodos();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR, textStatus, errorThrown);
    });
  }

  $(function () {
    $('#openCreateUser').on('click', function () {
      Metro.dialog.open('#createUserDialog');
    });

    $('#createUserDialog').on('click', 'button.button.primary', function () {
      $('#createUserForm').submit();
    });

    $('#createUserForm').submit(function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        return;
      }

      createUser($('#createUserName').val());
      Metro.dialog.close('#createUserDialog');
    });

    $('#todoList')
      .on('click', 'li button.mini.primary', function () {
        const $li = $(this).closest('li');

        if (!$li.children('input[type="text"]').val()) {
          return false;
        }

        createTodo($li.data('userid'), $li.children('input[type="text"]').val());
      })
      .on('click', 'li button.mini.alert', function () {
        deleteTodo($(this).closest('li').data('todoid'));
      });

    // init
    getTodos();
  });
})(jQuery);
