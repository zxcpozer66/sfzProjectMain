import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useEffect, useRef, useState } from 'react'
import type { User } from '../interfaces/modelsTypes/user'
import type { AddOption } from '../interfaces/otherTypes/addOption'
import { getUsers } from './../api'

type UsersOptionType = User | AddOption

interface SearchSelectProps {
	setShowDepartmentSelect?: (value: boolean) => void
	setNewUser?: (value: boolean) => void
	setNewUserData?: (value: {
		surname: string
		name: string
		patronymic: string
		department_id?: number
	}) => void
	formData?: {
		user_id: string | number
		department_id: number
	}
	setFormData?: (data: any) => void
}

export default function SearchSelect({
	setShowDepartmentSelect,
	setNewUser,
	setNewUserData,
	formData,
	setFormData,
}: SearchSelectProps) {
	const [value, setValue] = useState<UsersOptionType | null>(null)
	const [users, setUsers] = useState<User[]>([])
	const isCreating = useRef(false)

	useEffect(() => {
		getUsers()
			.then(res => setUsers(res.data))
			.catch(console.error)
	}, [])

	return (
		<Autocomplete
			value={value as User | null | undefined}
			onChange={(_event, newValue: UsersOptionType | null) => {
				if (typeof newValue === 'string') {
					
					const parts = (newValue as string).trim().split(/\s+/)
					setValue({
						id: 0,
						surname: parts[0] || '',
						name: parts[1] || '',
						patronymic: parts[2] || '',
					})
				} else if (newValue && 'inputValue' in newValue) {
					if (isCreating.current) return
					isCreating.current = true

					const parts = newValue.inputValue.trim().split(/\s+/)

					const newPerson = {
						surname: parts[0] || '',
						name: parts[1] || '',
						patronymic: parts[2] || '',
					}

					setShowDepartmentSelect?.(true)
					setNewUser?.(true)
					setNewUserData?.(newPerson)

					setValue({
						...newPerson,
						inputValue: newValue.inputValue,
					})
					
					setTimeout(() => {
						isCreating.current = false
					}, 0)
				} else if (newValue) {
					setValue(newValue)
					if (setFormData) {
						setFormData({
							...formData,
							user_id: newValue.id.toString(),
							department_id: newValue.department_id?.toString() || '',
						})
					}
					setNewUser?.(false);
					setShowDepartmentSelect?.(false);
				}
			}}
			filterOptions={(options, params) => {
				const { inputValue } = params
				const query = inputValue.toLowerCase()

				const filtered = options.filter(option => {
					if ('inputValue' in option) return true
					const fullName =
						`${option.surname} ${option.name} ${option.patronymic}`.toLowerCase()
					return fullName.includes(query)
				})

				const isExisting = filtered.some(option => {
					if ('inputValue' in option) return false
					const fullName =
						`${option.surname} ${option.name} ${option.patronymic}`.toLowerCase()
					return fullName === query
				})

				if (inputValue !== '' && !isExisting) {
					filtered.push({
						inputValue,
						name: `Добавить "${inputValue}"`,
						surname: '',
						patronymic: '',
					})
				}

				return filtered
			}}
			selectOnFocus
			clearOnBlur
			handleHomeEndKeys
			options={users}
			getOptionLabel={option => {
				if (typeof option === 'string') {
					return option
				}
				if ('inputValue' in option) {
					return option.inputValue
				}
				return `${option.surname} ${option.name} ${option.patronymic}`.trim()
			}}
			renderOption={(props, option) => {
				const { key, ...rest } = props
				const uniqueKey =
					'inputValue' in option
						? `add-${option.inputValue}`
						: option.id.toString()
				return (
					<li key={uniqueKey} {...rest}>
						{'inputValue' in option
							? `Добавить: ${option.inputValue}`
							: `${option.surname} ${option.name} ${option.patronymic}`}
					</li>
				)
			}}
			sx={{ marginTop: '14px', marginBottom: '35px' }}
			renderInput={params => <TextField {...params} label='Пользователь' />}
		/>
	)
}
