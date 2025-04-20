import "./Card.css";

export default function Card(props) {
  const bgStyle = {
    backgroundImage: `url('${props.imageUrl}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "300px",
    color: "white",
  };
  return (
    <div className="card" onClick={props.onClick}>
      <img src={props.imageUrl} />
      <div>
        <p>{props.name}</p>
      </div>
    </div>
  );
}
