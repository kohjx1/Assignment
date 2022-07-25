const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              Kanban
            </a>
          </div>
          <ul className="nav navbar-nav">
            <li className="active">
              <a href="#">Group Management</a>
            </li>
            <li className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                User Management<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#">Create User</a>
                </li>
                <li>
                  <a href="#">Edit User</a>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#">
                <span className="glyphicon glyphicon-user"></span> Profile
              </a>
            </li>
            <li>
              <a href="#" onClick={appDispatch({ type: "login", data: response.data })}>
                <span className="glyphicon glyphicon-log-in"></span> Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
export default Navbar
