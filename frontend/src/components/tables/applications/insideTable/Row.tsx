import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useState, type FC, useEffect } from 'react'
import { deleteApplication } from '../../../../api'
import type { User } from '../../../../interfaces/modelsTypes/user'
import { calculateTimeDifference, formatTimeDifference } from '../../../../utils/utils'
import AlertDialog from '../../../modals/AlertDialog'
import { useRequestForm } from '../../../RequestFormContext'
import { DetailTable } from './Details'

interface IProps {
  refetchApplications: () => void
  reactionOptions: any
  notationOptions: any
  userList: User[]
  masterList: User[]
}

export const Row: FC<IProps> = ({
  refetchApplications,
  reactionOptions,
  notationOptions,
  userList,
  masterList,
}) => {
  const { formData, setFormData, editMode, setEditMode, handleSave } = useRequestForm()
  const [open, setOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [initialFormData, setInitialFormData] = useState(formData)

  const { id, data, department, user, master, appeal_title } = formData
  const timeDiff = calculateTimeDifference(formData.start_time, formData.end_time)

  useEffect(() => {
    setInitialFormData(formData)
  }, [formData])


  useEffect(() => {
    if (!editMode) {
      setFormData(initialFormData)
    }
  }, [editMode, initialFormData, setFormData])
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatFullName = (userData: any): string => {
    if (!userData) return 'Не указан'
    if (typeof userData === 'object') {
      return `${userData.surname} ${userData.name[0]}.${userData.patronymic[0]}.`
    }
    return userData
  }

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setDeletingId(id)
    setIsDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingId === null) return
    try {
      await deleteApplication(deletingId)
      refetchApplications()
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error)
    } finally {
      setIsDialogOpen(false)
      setDeletingId(null)
    }
  }

  const renderUserAutocomplete = (isMaster: boolean) => {
    const options = isMaster ? masterList : userList
    const value = isMaster 
      ? masterList.find(u => u.id === master?.id) 
      : userList.find(u => u.id === user?.id)
    const label = isMaster ? 'Мастер' : 'Пользователь'
    return (
      <Autocomplete
        options={options}
        getOptionLabel={(option: User) => `${option.surname} ${option.name} ${option.patronymic}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={value || null}
        onChange={(event, newValue) => {
          handleInputChange(isMaster ? 'master' : 'user', newValue || '')
          event.stopPropagation()
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant='outlined'
            size='small'
            label={label}
            onClick={e => e.stopPropagation()}
			onDoubleClick={e => e.stopPropagation()}
          />
        )}
        sx={{ width: 250 }}
      />
    )
  }

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <>
      <TableRow
        sx={{ cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
        onDoubleClick={e => {
          stopPropagation(e)
          setEditMode(!editMode)
          setOpen(true)
        }}
        
      >
        <TableCell align='center'>
          {data ? new Date(data).toLocaleDateString() : 'Нет даты'}
        </TableCell>

        <TableCell align='center'>
          {typeof department === 'string' ? department : department?.title || ''}
        </TableCell>

        <TableCell align='center'>
          {editMode ? renderUserAutocomplete(false) : formatFullName(user)}
        </TableCell>

        <TableCell align='center'>
          {editMode ? renderUserAutocomplete(true) : formatFullName(master)}
        </TableCell>

        <TableCell align='left'>
          {editMode ? (
            <TextField
              value={appeal_title || ''}
              onChange={e => handleInputChange('appeal_title', e.target.value)}
              onClick={stopPropagation}
			  onDoubleClick={stopPropagation}
              fullWidth
              variant='outlined'
              size='small'
              label='Заголовок обращения'
            />
          ) : (
            appeal_title || 'Нет заголовка'
          )}
        </TableCell>

        <TableCell align='center'>{formatTimeDifference(timeDiff)}</TableCell>

        <TableCell align='center' sx={{ padding: '8px', height: 56 }}>
          {editMode ? (
            <Button
              color='primary'
              variant='outlined'
              size='small'
              onClick={e => {
                stopPropagation(e)
                handleSave()
                setOpen(false)
              }}
            >
              Сохранить
            </Button>
          ) : (
            <DeleteForeverIcon
              color='error'
              titleAccess='Удалить'
              onClick={e => handleDeleteClick(e, id)}
              style={{ cursor: 'pointer' }}
            />
          )}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Детали заявки
              </Typography>
              <DetailTable
                reactionOptions={reactionOptions}
                notationOptions={notationOptions}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <AlertDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        textMessage={
          'Удаление уже выполненной заявки приведет к потере учета времени, потраченного на нее. Это время не войдет в расчет отпускных.'
        }
      />
    </>
  )
}