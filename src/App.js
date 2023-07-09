import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:80/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    if (!name || !email) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const updateUser = async () => {
    if (!name || !email) return;

    try {
      const response = await fetch(`${API_URL}/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const updatedUser = await response.json();
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      setName('');
      setEmail('');
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      const updatedUsers = users.filter((user) => user._id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditingUserId(user._id);
  };

  const cancelEdit = () => {
    setName('');
    setEmail('');
    setEditingUserId(null);
  };

  return (
    <div className="container mt-4">
      <h1>Usuarios CRUD App Demo</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editingUserId) {
            updateUser();
          } else {
            createUser();
          }
        }}
      >
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="d-grid gap-2">
          {editingUserId ? (
            <>
              <button type="submit" className="btn btn-primary">
                Actualizar usuario
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button type="submit" className="btn btn-primary">
              Crear usuario
            </button>
          )}
        </div>
      </form>

      <h2 className="mt-4">Usuarios</h2>

      <ul className="list-group mt-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <span className="fw-bold">{user.name}</span> - {user.email}
            </div>
            <div>
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() => editUser(user)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteUser(user._id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
