import React from "react";

// Component for displaying a list of users with actions to edit or delete
const UserList = ({
  users,
  onDelete,
  onStartEdit,
  editingUserId,
  newRole,
  setNewRole,
  handleRoleUpdate,
}) => {
  return (
    <table className="users-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Position</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.department}</td>
            <td>{user.position}</td>
            <td>
              {editingUserId === user._id ? (
                <select
                  className="role-dropdown"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              ) : (
                user.role
              )}
            </td>
            <td>
              {editingUserId === user._id ? (
                <button
                  className="save-btn"
                  onClick={() => handleRoleUpdate(user._id)} // Calls handleRoleUpdate with the user's id
                >
                  Save
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onStartEdit(user._id, user.role)} // Prepares to edit the user's role
                    className="edit-btn"
                  >
                    Edit Role
                  </button>
                  <button
                    onClick={() => onDelete(user._id)} // Deletes the user
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
