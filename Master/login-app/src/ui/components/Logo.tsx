import logo from '../../assets/logo.png';

// Definimos las props que nuestro componente puede recibir
interface LogoProps {
  className?: string;
}

// El componente ahora es más simple. Recibe 'className' y lo aplica a la imagen.
function Logo({ className }: LogoProps) {
  return (
    <img
      className={className}
      src={logo}
      alt="Logo de AleskySalud"
    />
  );
}

export default Logo;