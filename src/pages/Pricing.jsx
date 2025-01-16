import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import '../styles/pricing.css';


function Pricing() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        credits: '',
        acceptTerms: false,
    });
    const [totalCost, setTotalCost] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchCreditsCost = async (amount) => {
        const creditsData = { amount };
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/price`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(creditsData),
            });

            if (response.ok) {
                const data = await response.json();
                return data.costo; // Devuelve el costo directamente
            } else {
                console.error('Error al calcular el costo de los créditos');
                return null;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return null;
        }
    };

    useEffect(() => {
        const updateCostFromLocation = async () => {
            if (location.state?.credits) {
                const credits = location.state.credits;

                // Actualiza el formulario con los créditos desde el estado
                setFormData((prevData) => ({
                    ...prevData,
                    credits,
                }));

                // Consulta el costo de los créditos y actualiza el estado totalCost
                const totalCost = await fetchCreditsCost(credits);
                if (totalCost !== null) {
                    setTotalCost(totalCost);
                }
            }
        };

        updateCostFromLocation();
    }, [location.state]);

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (name === 'credits') {
            const totalCost = await fetchCreditsCost(value); // Llama a la función reutilizable
            if (totalCost !== null) {
                setTotalCost(totalCost);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        const paymentData = {
            amount: formData.credits
        }
        try {
            // Simular redirección a una plataforma de pago
            toast.success('Redirigiendo a la plataforma de pago...');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-payment`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Enlace de compra:', data.payment_url);
                // Redirige a la URL de pago proporcionada por el backend
                window.location.href = data.payment_url;
            } else {
                console.error('Error al generar el enlace de compra');
            }
            //setTimeout(() => navigate('/payment-platform'), 2000);
        } catch (error) {
            console.error('Error en la operación:', error);
            setError('Ocurrió un error al procesar la operación.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = () => {
        if (!formData.credits || isNaN(formData.credits) || formData.credits <= 0) {
            toast.error('Por favor, ingresa una cantidad válida de créditos.');
            return false;
        }
        if (!formData.acceptTerms) {
            toast.error('Debes aceptar los términos y condiciones.');
            return false;
        }
        return true;
    };

    return (
        <div className="pricing-container-p">
            <div className="pricing-box-p">
                <h1 className="pricing-title-p">Comprar Créditos</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Cantidad de créditos</label>
                        <input
                            type="number"
                            name="credits"
                            placeholder="Ejemplo: 10"
                            value={formData.credits}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Precio total</label>
                        <input
                            type="text"
                            value={`$${totalCost} USD`}
                            readOnly
                            className="readonly-input"
                        />
                    </div>

                    <div className="form-group terms">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                        />
                        <label>Acepto los términos y condiciones</label>
                    </div>

                    <div className="button-container">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Procesando...' : 'Comprar Créditos'}
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Pricing;
