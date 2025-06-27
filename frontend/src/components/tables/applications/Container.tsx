import AddIcon from '@mui/icons-material/Add'
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material'
import { useEffect, useState, type FC } from 'react'
import { AddRequestModal } from '../../modals/AddRequestModal'
import { RequestFormProvider } from '../../RequestFormContext'
import { Row } from './insideTable/Row'

import { getApplications } from '../../../api/modelApi/application'

import {
	getDepartments,
	getNotation,
	getReactions,
	getUsers,
	getUsersRole,
} from '../../../api'
import type { RequestData } from '../../../interfaces/api/requestData'
import type { User } from '../../../interfaces/modelsTypes/user'
import { useAuth } from '../../../useAuth'
import type { Department } from '../../../interfaces/modelsTypes/department'

export const CollapsibleTable: FC = () => {
	const [reactionOptions, setReactionOptions] = useState<any[]>([])
	const [notationOptions, setNotationOptions] = useState<any[]>([])
	const [departments, setDepartments] = useState<Department[]>([])
	const [applications, setApplications] = useState<RequestData[]>([])
	const [userList, setUserList] = useState<User[]>([])
	const [masterList, setMasterList] = useState<User[]>([])
	const [modalOpen, setModalOpen] = useState(false)

	const { user } = useAuth()

	const handleModal = () => setModalOpen(!modalOpen)

	useEffect(() => {
		const loadOptions = async () => {
			try {
				const resNotation = await getNotation()
				setNotationOptions(resNotation?.data ?? [])
			} catch (error) {
				console.error('Ошибка при загрузке Notation:', error)
				setNotationOptions([])
			}

			try {
				const resReaction = await getReactions()
				setReactionOptions(resReaction?.data ?? [])
			} catch (error) {
				console.error('Ошибка при загрузке Reactions:', error)
				setReactionOptions([])
			}
		}

		const fetchDepartments = async () => {
			try {
				const res = await getDepartments()
				setDepartments(res?.data ?? [])
			} catch (error) {
				console.error('Ошибка при загрузке Departments:', error)
				setDepartments([])
			}
		}

		loadOptions()
		fetchDepartments()
	}, [])

	const titleCell = [
		'Дата',
		'Отдел',
		'Пользователь',
		'Мастер',
		'Обращение',
		'Время',
	]

	const fetchData = async () => {
		try {
			const response = await getApplications()
			setApplications(response?.data ?? [])

		} catch (error) {
			console.error('Ошибка при загрузке Applications:', error)
			setApplications([])
		}
	}

	useEffect(() => {
		fetchData()

		getUsersRole(3, true)
			.then(res => setMasterList(res ?? []))
			.catch(err => {
				console.error('Ошибка при загрузке Users:', err)
				setMasterList([])
			})

		getUsers()
			.then(res => setUserList(res.data))
			.catch(err => {
				console.error('Ошибка при загрузке Users:', err)
				setUserList([])
			})
	}, [])


	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)

	const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)

	const handleChangeRowsPerPage = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(e.target.value, 10))
		setPage(0)
	}
	return (
		<>
			<TableContainer component={Paper}>
				<Table aria-label='collapsible table'>
					<TableHead>
						<TableRow>
							{titleCell.map((title, index) => (
								<TableCell
									key={index}
									align={title === 'Обращение' ? 'left' : 'center'}
									sx={{ fontSize: 16 }}
								>
									{title}
								</TableCell>
							))}
							<TableCell align='center'>
								{user?.role_id === 3 && (
									<Button
										variant='contained'
										endIcon={<AddIcon />}
										onClick={handleModal}
									>
										Добавить
									</Button>
								)}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{applications.length > 0 ? (
							applications
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map(row => (
									<RequestFormProvider key={row.id} initialData={row}>
										<Row
											refetchApplications={fetchData}
											reactionOptions={reactionOptions}
											notationOptions={notationOptions}
											userList={userList}
											masterList={masterList}
										/>
									</RequestFormProvider>
								))
						) : (
							<TableRow>
								<TableCell colSpan={titleCell.length + 1} align='center'>
									Нет данных для отображения
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				labelRowsPerPage='Количество записей:'
				rowsPerPageOptions={[5, 10, 25]}
				component='div'
				count={applications.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelDisplayedRows={({ from, to, count }) =>
					`${from}-${to} из ${count}`
				}
			/>
			<AddRequestModal
				open={modalOpen}
				onClose={handleModal}
				onSubmit={fetchData}
				refetchApplications={fetchData}
				departments={departments}
			/>
		</>
	)
}
