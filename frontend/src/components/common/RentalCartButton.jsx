import { Link } from 'react-router-dom';
import { useRental } from '../../contexts/RentalContext';
import '../../styles/components/rentalCartButton.css';

function RentalCartButton() {
  const { rentalList } = useRental();

  if (rentalList.length === 0) return null;

  return (
    <Link to="/rental/works" className="rental-cart-btn">
      🖼️ {rentalList.length}
    </Link>
  );
}

export default RentalCartButton;
