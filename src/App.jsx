import { useRef, useEffect } from 'react';
import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './App.css';

function App() {
	const buttonRef = useRef(null);

	const schema = yup.object({
		email: yup
			.string()
			.email('Неверный формат email')
			.required('Email обязательное поле'),
		password: yup
			.string()
			.min(6, 'Пароль должен быть не менее 6 символов')
			.max(30, 'Пароль должен быть не более 30 символов')
			.required('Пароль обязательное поле'),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], 'Пароли не совпадают')
			.required('Подтвердите пароль'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		control,
		trigger,
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	});

	const password = useWatch({ name: 'password', control });
	const confirmPassword = useWatch({
		name: 'confirmPassword',
		control,
	});

	useEffect(() => {
		if (
			password &&
			confirmPassword &&
			password === confirmPassword &&
			buttonRef.current &&
			!errors.password &&
			!errors.confirmPassword
		) {
			buttonRef.current.focus();
		}
	}, [password, confirmPassword, errors.password, errors.confirmPassword]);

	useEffect(() => {
		if (confirmPassword) {
			trigger('confirmPassword');
		}
	}, [password, trigger, confirmPassword]);

	const onSubmit = (data) => {
		console.log(data);
	};

	return (
		<div className="container">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<input type="email" {...register('email')} placeholder="Email" />
					{errors.email && <span className="error">{errors.email.message}</span>}
				</div>

				<div>
					<input type="password" {...register('password')} placeholder="Пароль" />
					{errors.password && <span className="error">{errors.password.message}</span>}
				</div>

				<div>
					<input
						type="password"
						{...register('confirmPassword')}
						placeholder="Повтор пароля"
					/>
					{errors.confirmPassword && (
						<span className="error">{errors.confirmPassword.message}</span>
					)}
				</div>

				<button type="submit" disabled={!isValid} ref={buttonRef}>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
}

export default App;
