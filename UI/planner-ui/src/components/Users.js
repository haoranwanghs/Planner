import useSWR from 'swr';
import * as React from 'react';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { BasicAddModal, useEditModal } from './Modal';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import EditIcon from '@mui/icons-material/Edit';

function UserAvatar({ user, onDelete, onEdit }) {
  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={
        <>
          {onDelete && (
            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(user)}>
              <DeleteIcon />
            </IconButton>
          )}
          {onEdit && (
            <IconButton edge="end" aria-label="delete" onClick={() => onEdit(user)}>
              <EditIcon />
            </IconButton>
          )}
        </>
      }
    >
      <ListItemAvatar>
        <Avatar src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={user.name}
        secondary={
          <div style={{ padding: '2px' }}>
            <Chip label={user.tag} />
          </div>
        }
      />
    </ListItem>
  );
}

function UsersList({ users, onDelete, onEdit }) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {users.map((user, index) => (
        <>
          <UserAvatar user={user} onDelete={onDelete} onEdit={onEdit} />
          {index !== users.length - 1 && <Divider variant="inset" component="li" />}
        </>
      ))}
    </List>
  );
}
let localUsers = [
  {
    name: 'Abhilash',
    tag: 'android'
  },
  {
    name: 'Arun',
    tag: 'backend'
  },
  {
    name: 'Ayesha',
    tag: 'frontend'
  },
  {
    name: 'Davendar',
    tag: 'backend'
  },
  {
    name: 'Deepak',
    tag: 'pm'
  },
  {
    name: 'Harsh',
    tag: 'ios'
  },
  {
    name: 'Manali',
    tag: 'frontend'
  },
  {
    name: 'Utsav',
    tag: 'pm'
  }
];
const fetcher = (...args) => Promise.resolve(localUsers);

function useUser(id) {
  const { data, error, isLoading } = useSWR(`/api/user/${id}`, fetcher);

  return {
    users: data,
    isLoading,
    isError: error
  };
}

export default function IconLabelButtons({ onDelete, formElement }) {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" startIcon={<DeleteIcon />} onClick={onDelete}>
        Delete
      </Button>
      <BasicAddModal formElement={formElement} />
    </Stack>
  );
}

const Form = ({ onSubmit, data }) => {
  return (
    <FormContainer
      defaultValues={data}
      onSuccess={(data) => {
        console.log(data);
        onSubmit(data);
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '200px',
          justifyContent: 'space-between'
        }}
      >
        <TextFieldElement name="name" label="Name" required />
        <TextFieldElement name="tag" label="Tag" required />
        <Button type={'submit'} variant={'contained'} color={'primary'}>
          Submit
        </Button>
      </div>
    </FormContainer>
  );
};

const addAPI = (user) => {
  localUsers.push(user);
  console.log(localUsers);
  return Promise.resolve();
};
const deleteAPI = (toBeDeleted) => {
  localUsers = localUsers.filter((user) => user.name !== toBeDeleted.name);
  return Promise.resolve();
};
const editAPI = (toBeEdit) => {
  const index = localUsers.findIndex((user) => user.name === toBeEdit.name);
  localUsers[index] = toBeEdit;
  console.log(localUsers, toBeEdit);
  return Promise.resolve();
};
function Users() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const refresh = () => setRefreshFlag((prev) => prev + 1);
  const [isDeleting, setDeletingStatus] = useState(false);
  const deleteCB = isDeleting
    ? (user) => {
        const finish = deleteAPI(user);
        finish.then(refresh);
        return finish;
      }
    : undefined;
  const addCB = (user) => {
    addAPI(user);
    refresh();
  };
  const { users, isLoading } = useUser(refreshFlag);

  const [element, handleEdit] = useEditModal(Form, editAPI);

  if (isLoading) return `loading`;
  return (
    <div style={{ height: '100%' }}>
      <h3>Members</h3>
      <IconLabelButtons
        // onAdd={addCB}
        formElement={<Form onSubmit={addCB} />}
        onDelete={() => {
          setDeletingStatus((previous) => !previous);
        }}
      />
      <UsersList users={users} onDelete={deleteCB} onEdit={handleEdit} />
      {element}
    </div>
  );
}

export { Users };
