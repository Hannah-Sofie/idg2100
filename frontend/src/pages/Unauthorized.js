import "../styles/Inaccessible.css";
import NoAccess from "../assets/img/no-access.png";

const Unauthorized = () => {
  return (
    <div className="unauthorized">
      <img src={NoAccess} alt="No Access" />
      <h1>Unauthorized</h1>
      <p>You do not have access to the requested page.</p>
    </div>
  );
};

export default Unauthorized;
