import { useState, useRef } from 'react';
import * as yup from 'yup';
import './App.css';

function App() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const buttonRef = useRef(null);

	const emailSchema = yup
		.string()
		.email('Неверный формат email')
		.required('Email обязательное поле');

	function validateEmail(value) {
		try {
			emailSchema.validateSync(value);
			setError({ ...error, email: '' });
		} catch (err) {
			setError({ ...error, email: err.message });
		}
	}

	function validatePassword(value) {
		if (!value) setError({ ...error, password: 'Пароль обязательное поле' });
		else if (value.length < 6)
			setError({ ...error, password: 'Пароль должен быть не менее 6 символов' });
		else {
			setError({ ...error, password: '' });
		}
	}

	function validateConfirmPassword(value, password) {
		if (!value) setError({ ...error, confirmPassword: 'Подтвердите пароль' });
		else if (value !== password)
			setError({ ...error, confirmPassword: 'Пароли не совпадают' });
		else {
			setError({ ...error, confirmPassword: '' });
		}
	}

	function checkPasswordAndFocusButton(confirmPasswordValue) {
		// email без ошибок и пароли совпадают — фокус на кнопку
		if (error.email === '' && confirmPasswordValue === password) {
			setTimeout(() => {
				if (buttonRef.current) buttonRef.current.focus();
			}, 0);
		}
	}

	const isFormValid =
		error.email === '' && error.password === '' && error.confirmPassword === '';

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log({
			email: email,
			password: password,
			confirmPassword: confirmPassword,
		});
	};

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<div>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onBlur={() => validateEmail(email)}
						placeholder="Email"
					/>
					{error.email && <span className="error">{error.email}</span>}
				</div>

				<div>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onBlur={() => validatePassword(password)}
						placeholder="Пароль"
					/>
					{error.password && <span className="error">{error.password}</span>}
				</div>

				<div>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
							// Если все поля валидны — ставим фокус на кнопку
							checkPasswordAndFocusButton(e.target.value);
						}}
						onBlur={() => validateConfirmPassword(confirmPassword, password)}
						placeholder="Повтор пароля"
					/>
					{error.confirmPassword && (
						<span className="error">{error.confirmPassword}</span>
					)}
				</div>

				<button type="submit" disabled={!isFormValid} ref={buttonRef}>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
}

export default App;
