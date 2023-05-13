import useSWR from 'swr';
import * as React from 'react';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { BasicAddModal, useEditModal } from './Modal';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import { SubProjects } from './SubProject';
let localData = [
  {
    id: 'uuid1',
    name: 'A',
    priority: 0,
    subProjects: [
      {
        id: 'uuid2',
        name: 'A-dev',
        priority: 0,
        manWeekEstimation: 2,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 4,
        dependsOnSubProjectIds: ['uuid1'],
        requiredMemberTag: 'backend'
      },
      {
        id: 'uuid1',
        name: 'A-prd',
        priority: 0,
        manWeekEstimation: 1,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 4,
        dependsOnSubProjectIds: [],
        requiredMemberTag: 'pm'
      }
    ],
    earliestStartWeekId: 1,
    latestCompleteWeekId: 4
  },
  {
    id: 'uuid2',
    name: 'B',
    priority: 0,
    subProjects: [
      {
        id: 'uuid4',
        name: 'B-dev',
        priority: 0,
        manWeekEstimation: 2,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 8,
        dependsOnSubProjectIds: ['uuid3'],
        requiredMemberTag: 'backend'
      },
      {
        id: 'uuid3',
        name: 'B-prd',
        priority: 0,
        manWeekEstimation: 1,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 8,
        dependsOnSubProjectIds: [],
        requiredMemberTag: 'pm'
      },
      {
        id: 'uuid5',
        name: 'B-test',
        priority: 0,
        manWeekEstimation: 2,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 8,
        dependsOnSubProjectIds: ['uuid3'],
        requiredMemberTag: 'test'
      }
    ],
    earliestStartWeekId: 1,
    latestCompleteWeekId: 8
  }
];

function UserAvatar({ user, onDelete, onEdit, onExpand }) {
  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={
        <>
          {onEdit && (
            <IconButton edge="end" aria-label="delete" onClick={() => onEdit(user)}>
              <EditIcon />
            </IconButton>
          )}
          {onExpand && (
            <IconButton edge="end" aria-label="delete" onClick={() => onExpand(user)}>
              <AddCircleIcon />
            </IconButton>
          )}
          {onDelete && (
            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(user)}>
              <DeleteIcon />
            </IconButton>
          )}
        </>
      }
    >
      {/* <ListItemAvatar>
        <Avatar src="/static/images/avatar/1.jpg" />
      </ListItemAvatar> */}

      <ListItemText primary={user.name} />
    </ListItem>
  );
}
const addAPI = (data) => {
  localData.push(data);
  console.log(localData);
  return Promise.resolve();
};
const deleteAPI = (toBeDeleted) => {
  localData = localData.filter((user) => user.id !== toBeDeleted.id);
  return Promise.resolve();
};
const editAPI = (toBeEdit) => {
  const index = localData.findIndex((user) => user.id === toBeEdit.id);
  localData[index] = toBeEdit;
  console.log(localData, toBeEdit);
  return Promise.resolve();
};

function UsersList({ users, onDelete, onEdit, onExpand }) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {users.map((user, index) => (
        <>
          <UserAvatar user={user} onDelete={onDelete} onEdit={onEdit} onExpand={onExpand} />
          {index !== users.length - 1 && <Divider variant="inset" component="li" />}
        </>
      ))}
    </List>
  );
}
const fetcher = (...args) => Promise.resolve(localData);

function useUser(id) {
  const { data, error, isLoading } = useSWR(`/api/projects/${id}`, fetcher);

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
          height: '400px',
          justifyContent: 'space-between'
        }}
      >
        <TextFieldElement name="name" label="Name" required />
        <TextFieldElement name="priority" label="Priority" required />
        <TextFieldElement type="number" name="earliestStartWeekId" label="Start Week #" required />
        <TextFieldElement type="number" name="latestCompleteWeekId" label="End Week #" required />

        <Button type={'submit'} variant={'contained'} color={'primary'}>
          Submit
        </Button>
      </div>
    </FormContainer>
  );
};

function Projects() {
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
  const [elementForSubproject, onExpand] = useEditModal(SubProjects, () => Promise.resolve());

  if (isLoading) return `loading`;
  return (
    <div style={{ height: '100%' }}>
      <h3>Projects</h3>
      <IconLabelButtons
        // onAdd={addCB}
        formElement={<Form onSubmit={addCB} />}
        onDelete={() => {
          setDeletingStatus((previous) => !previous);
        }}
      />
      <UsersList users={users} onDelete={deleteCB} onEdit={handleEdit} onExpand={onExpand} />
      {element}
      {elementForSubproject}
    </div>
  );
}

export { Projects };
