import { Link, NavLink } from 'react-router-dom'

/** Ссылка внутри Layout — использует стандартные абсолютные пути с поддержкой basename от React Router */
export function AppLink({ to, className, children, onClick, ...rest }) {
  return (
    <Link to={to} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  )
}

export function AppNavLink({ to, end, className, children, onClick, ...rest }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={className}
      onClick={onClick}
      {...rest}
    >
      {children}
    </NavLink>
  )
}

