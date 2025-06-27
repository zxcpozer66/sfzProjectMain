import { useEffect, useState } from 'react'
import { UserTable } from './../components/tables/users/UserTable'

import type { UserData } from '../interfaces/types'
import { transformUserData } from '../utils/utils'
import {
	deleteUser,
	editUser,
	getCurrentUser,
	getDepartments,
	getRole,
	getUsersVacationInterval,
} from './../api/'
import type { Department } from '../interfaces/modelsTypes/department'

export function UsersPage() {
	const [users, setUsers] = useState<UserData[]>([])
	const [departments, setDepartments] = useState<Department[]>([])
	const [loading, setLoading] = useState(true)
	const [currentUser, setUser] = useState<UserData>()
	const [roles, setRoles] = useState([])
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const [usersRes, deptsRes, currentRes, roleRes] = await Promise.all([
					getUsersVacationInterval(),
					getDepartments(),
					getCurrentUser(),
					getRole()
				])

				const userDataArray = usersRes.data || []
				setUsers(transformUserData(userDataArray))
				setDepartments(deptsRes.data || [])
				setUser(currentRes.data)
				setRoles(roleRes.data)
			} catch (error) {
				console.error('Ошибка загрузки данных:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleEdit = async (id: number, data: Partial<UserData>) => {
		try {
			setLoading(true)
			await editUser(id, {
				name: data.name,
				surname: data.surname,
				patronymic: data.patronymic,
				department_id: data.department_id,
				role_id: data.role_id
			})

			setUsers(
				users.map(u =>
					u.id === id
						? {
								...u,
								...data,
								department:
									departments.find(d => d.id === data.department_id)?.title ||
									u.department,
						  }
						: u
				)
			)
			
		} catch (error) {
			console.error('Ошибка сохранения:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id: number) => {
		try {
			setLoading(true)
			await deleteUser(id)
			setUsers(users.filter(u => u.id !== id))
		} catch (error) {
			console.error('Ошибка удаления:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<UserTable
				users={users}
				departments={departments}
				currentUser={currentUser!}
				roles={roles}
				onEdit={handleEdit}
				onDelete={handleDelete}
				isLoading={loading}
			/>
		</div>
	)
}
