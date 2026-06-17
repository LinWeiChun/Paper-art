import BackToTopButton from './BackToTopButton';
import RentalCartButton from './RentalCartButton';

import '../../styles/components/floatingButtons.css';
function FloatingButtons() {
  return (
    <div className="floating-buttons">
      <RentalCartButton />
      <BackToTopButton />
    </div>
  );
}

export default FloatingButtons;
