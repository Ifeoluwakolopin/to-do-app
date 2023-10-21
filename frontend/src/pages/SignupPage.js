import SignUpForm from '../components/SignUpForm';
import { useApi } from '../contexts/ApiProvider';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
    const { fetchRequest } = useApi();
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();
        
        const username = event.target[0].value;
        const password = event.target[1].value;
        const confirmPassword = event.target[2].value;

        if(password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const user = {
            username,
            password
        };

        try {
            await fetchRequest('/signup', 'POST', user);
            navigate('/login', { state: { fromSignup: true } });
        } catch (error) {
            if (error.message && error.message.includes("409")) {  // Assuming 409 Conflict might indicate a duplicate user
                alert('Username already taken.');
            } else {
                alert('Failed to register. Please try again later.');
            }
        }
        
    };

    return (
        <div>
            <SignUpForm onSignUp={handleSignUp} />
        </div>
    );
};
