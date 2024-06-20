import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}

function App() {

  const [showAddFriend, SetShowAddFriend] = useState(false);
  const [friends, SetFriends] = useState(initialFriends);
  const [selectFreind, SetSelectFriend] = useState(null);


  function handleshowAddFriend() {
    SetShowAddFriend((show) => !show)
  }
  function handleAddFriends(friend) {
    SetFriends(friends => [...friends, friend]);
    SetShowAddFriend(false);

  }

  function handleSelection(friend) {
    SetSelectFriend((select) => select?.id === friend.id ? null : friend);
    SetShowAddFriend(false);
  }

  function handleSplitBill(value) {

    SetFriends((friends) => friends.map((friend) => friend.id === selectFreind.id ? { ...friend, balance: friend.balance + value } : friend));
    SetSelectFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} onSelection={handleSelection} selectFreind={selectFreind} />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriends} />}
        {showAddFriend ? <Button onClick={handleshowAddFriend}>Close</Button> : <Button onClick={handleshowAddFriend}>Add Friend</Button>}
      </div>
      {selectFreind && <FormSplitBill selectedFreind={selectFreind} onSplitBill={handleSplitBill} />}
    </div>
  );
}

function FriendList({ friends, onSelection, selectFreind }) {
  return (
    friends.map(
      (friend) => (<Friend key={friend.id} friend={friend} onSelection={onSelection} selectFreind={selectFreind} />)

    ))
}


function Friend({ friend, onSelection, selectFreind }) {

  const isSelected = selectFreind?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h1>{friend.name}</h1>
      {friend.balance > 0 && (<p className="green">{friend.name} owes you {friend.balance}$  </p>)
      }
      {friend.balance < 0 && (<p className="red">You owe {friend.name} {friend.balance}$  </p>)
      }
      {friend.balance === 0 && (<p > You and {friend.name}  are even</p>)
      }
      <Button onClick={() => { onSelection(friend) }}>{isSelected ? "Close" : "select"}</Button>
    </li>
  )
}



function FormAddFriend({ onAddFriend }) {

  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID()

    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48")
  }
  return (<form className="form-add-friend" onSubmit={handleSubmit}>
    <h2>Split a bill with X</h2>
    <label>🧑‍🤝‍🧑Friend Name </label>
    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    <label>🌄Image URL</label>
    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
    <Button>Add</Button>
  </form>);
}
function FormSplitBill({ selectedFreind, onSplitBill }) {
  const [bill, SetBill] = useState("");
  const [paidbyUser, SetPaidbyUser] = useState("")
  const [whoisPaying, SetWhoisPaying] = useState("user")
  const paidByFriend = bill ? bill - paidbyUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidbyUser) return;

    onSplitBill(whoisPaying === "user" ? paidByFriend : -paidbyUser);
  }


  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFreind.name}</h2>
      <label>Bill Value</label>
      <input type="text" value={bill} onChange={(e) => SetBill(Number(e.target.value))} />
      <label>Your expenses</label>
      <input type="text" value={paidbyUser} onChange={(e) => SetPaidbyUser(Number(e.target.value) > bill ? paidbyUser : Number(e.target.value))} />
      <label>{selectedFreind.name}'s expenses</label>
      <input type="text" disabled value={paidByFriend} />
      <label>Who is paying the Bill</label>
      <select value={whoisPaying} onChange={(e) => SetWhoisPaying(e.target.value)} >
        <option value="user ">You</option>
        <option value="friend">{selectedFreind.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  )
}
export default App;
