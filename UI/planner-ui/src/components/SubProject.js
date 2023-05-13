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
import { FormContainer, TextFieldElement, MultiSelectElement } from 'react-hook-form-mui';
import EditIcon from '@mui/icons-material/Edit';
import { useNow } from '@mui/x-date-pickers/internals';

let localData = [
  {
    id: 'uuid2',
    name: 'A-dev',
    projectId: 'uuid1',
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
    projectId: 'uuid1',
    name: 'A-prd',
    priority: 0,
    manWeekEstimation: 1,
    maxParallelDegree: 1,
    earliestStartWeekId: 1,
    latestCompleteWeekId: 4,
    dependsOnSubProjectIds: [],
    requiredMemberTag: 'pm'
  }
];

function UserAvatar({ user, onDelete, onEdit }) {
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

      <ListItemText primary={user.name} secondary={``} />
    </ListItem>
  );
}
const addAPI = (data) => {
  localData.push({ id: `${Date.now()}`, ...data });
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
  const { data, error, isLoading } = useSWR(`/api/subprojects/${id}`, fetcher);

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
// id: 'uuid2',
// name: 'A-dev',
// priority: 0,
// manWeekEstimation: 2,
// maxParallelDegree: 1,
// earliestStartWeekId: 1,
// latestCompleteWeekId: 4,
// dependsOnSubProjectIds: ['uuid1'],
// requiredMemberTag: 'backend'

function useSubProjects(id) {
  const { data, error, isLoading } = useSWR(`/api/subprojects${id}`, fetcher);

  return {
    subprojects: data,
    isLoading,
    isError: error
  };
}
const Form = ({ onSubmit, data, id }) => {
  const { subprojects, isLoading } = useSubProjects();

  const options = (subprojects ?? []).filter((pj) => pj.id !== data?.id);
  console.log(data, 'id', id, subprojects, options, isLoading);
  return (
    <FormContainer
      defaultValues={data ?? { projectId: id }}
      onSuccess={(data) => {
        console.log(data);
        onSubmit(data);
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '600px',
          justifyContent: 'space-between'
        }}
      >
        <TextFieldElement name="name" label="Name" required />
        <TextFieldElement name="priority" label="Priority" required />
        <TextFieldElement name="projectId" label="projectId" required disabled />

        <TextFieldElement type="number" name="manWeekEstimation" label="Weeks to finish" required />
        <TextFieldElement
          type="number"
          name="maxParallelDegree"
          label="Max coperating members"
          required
        />
        <TextFieldElement type="number" name="earliestStartWeekId" label="Start Week #" required />
        <TextFieldElement type="number" name="latestCompleteWeekId" label="End Week #" required />
        <TextFieldElement name="requiredMemberTag" label="Required Tag" required />
        <MultiSelectElement
          options={options}
          itemKey="id"
          itemID="id"
          itemLabel="name"
          name="dependsOnSubProjectIds"
          label="Dependencies"
          showCheckbox
          required
        />

        <Button type={'submit'} variant={'contained'} color={'primary'}>
          Submit
        </Button>
      </div>
    </FormContainer>
  );
};
function SubProjects({ data }) {
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
    console.log(user);
    addAPI(user);
    refresh();
  };
  const { users, isLoading } = useUser(refreshFlag);

  console.log('projec', data);
  const [element, handleEdit] = useEditModal(Form, editAPI);
  const [elementForSubproject, onExpand] = useEditModal(Form, () => Promise.resolve());

  if (isLoading) return `loading`;
  return (
    <div style={{ height: '100%' }}>
      <h3>Projects</h3>
      <IconLabelButtons
        // onAdd={addCB}
        formElement={<Form id={data.id} onSubmit={addCB} />}
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

export { SubProjects };
