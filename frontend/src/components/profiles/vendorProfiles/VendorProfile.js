import React, { Component } from "react";
import axios from "axios";
import { getFoodItemsByVendor } from "../../../utils/UtilFoodItems.js";
import AddItemForm from "./AddItemsForm.js";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CountUp from "react-countup";

import "./vendorProfilesCSS/VendorProfile.css";

class VendorProfile extends Component {
  constructor() {
    super();
    this.state = {
      quantity: "",
      name: "",
      set_time: "",
      toAddItem: false,
      hasAdded: false,
      claimedItems: [],
      unclaimedItems: [],
      fedCount: 0
    };
  }

  componentDidMount() {
    this.vendorDonations();
    this.getFeedingCount();
  }

  //get feeding count
  getFeedingCount = () => {
    axios.get("/api/fooditems/feedingcount").then(count => {
      this.setState({
        fedCount: +count.data.fedCount[0].sum
      });
    });
  };

  // Add food items
  addItemButton = () => {
    return (
      <>
        <p className="add-item-text">Add Item</p>
        <Fab
          color="primary"
          aria-label="Add"
          className="add-item-button"
          onClick={this.toAddItem}>
          <AddIcon />
        </Fab>
      </>
    );
  };

  toAddItem = () => {
    this.setState({
      toAddItem: !this.state.toAddItem
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitItem = e => {
    e.preventDefault();
    this.setState({
      hasAdded: true
    });
    const { quantity, name, set_time } = this.state;
    axios
      .post("/api/fooditems/", {
        quantity: quantity,
        name: name,
        set_time: set_time,
        vendor_id: this.props.currentUser.id
      })
      .then(() => {
        this.setState({
          toAddItem: false
        });
        this.vendorDonations();
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Get items
  vendorDonations = () => {
    let tempVar;
    if (this.props.currentUser.type === 2) {
      tempVar = this.props.match.params.vendor;
    }
    console.log(tempVar, "the temp var");
    getFoodItemsByVendor(!tempVar ? this.props.currentUser.name : tempVar).then(
      data => {
        let unclaimed = data.data.food_items.filter(item => {
          return item.is_claimed === false;
        });

        this.setState({
          unclaimedItems: unclaimed
        });
        let claimed = data.data.food_items.filter(item => {
          return item.is_claimed === true;
        });
        this.setState({
          claimedItems: claimed
        });
      }
    );
  };

  // Display items
  displayUnclaimedItems = () => {
    return this.state.unclaimedItems.map(item => {
      let converted_time = Number(item.set_time.slice(0, 2));
      return (
        <div key={item.food_id} id="display-unclaimed-items">
          <div id="item-name-container">
            <h4 id="item-name">Food Item:</h4>
            <p>{item.name}</p>
          </div>
          <div>
            <h4 id="weight">Weight: </h4>
            <p>{item.quantity * 3} pounds</p>
          </div>
          <div>
            <h4 id="feeds">Feeds: </h4>
            <p>{item.quantity} people</p>
          </div>
          <div>
            <h4 id="pick-up">Pick Up Time: </h4>
            <p>
              {converted_time === 0 || converted_time < 13
                ? converted_time + "am"
                : converted_time - 12 + "pm"}
            </p>
          </div>
          <div>
            {item.is_claimed ? (
              <div id="status-unavailable">Unavailable</div>
            ) : (
              <div id="status-available">Available</div>
            )}
          </div>
          <Button
            onClick={this.deleteItem}
            type="submit"
            variant="contained"
            color="secondary"
            id={item.food_id}>
            <DeleteIcon id={item.food_id} />
          </Button>
        </div>
      );
    });
  };

  displayClaimedItems = () => {
    return this.state.claimedItems.map(item => {
      let converted_time = Number(item.set_time.slice(0, 2));
      return (
        <div key={item.food_id} id="display-unclaimed-items">
          <div id="item-name-container">
            <h4 id="item-name">Food Item:</h4>
            <p>{item.name}</p>
          </div>
          <div>
            <h4 id="weight">Weight: </h4>
            <p>{item.quantity * 3} pounds</p>
          </div>
          <div>
            <h4 id="feeds">Feeds: </h4>
            <p>{item.quantity} people</p>
          </div>
          <div>
            <h4 id="pick-up">Pick Up Time: </h4>
            <p>
              {converted_time === 0 || converted_time < 13
                ? converted_time + "am"
                : converted_time - 12 + "pm"}
            </p>
          </div>
          <div>
            {item.is_claimed ? (
              <div id="status-unavailable">Unavailable</div>
            ) : (
              <div id="status-available">Available</div>
            )}
          </div>
          <Button
            onClick={this.deleteItem}
            type="submit"
            variant="contained"
            color="secondary"
            id={item.food_id}>
            <DeleteIcon id={item.food_id} />
          </Button>
        </div>
      );
    });
  };

  // Delete items
  deleteItem = e => {
    axios
      .delete(`/api/fooditems/${e.currentTarget.id}`)
      .then(() => {
        this.vendorDonations();
      })
      .then(() => {
        this.getFeedingCount();
      });
  };

  // Favorite vendor
  render() {
    let vendorUser;
    if (this.props.currentUser.type === 2) {
      vendorUser = this.props.match.params.vendor;
    }
    return (
      <div id="vendor-container">
        <div id="vendor-profile-container">
          <h1 id="vendor-name">
            {" "}
            {!vendorUser ? this.props.currentUser.name : vendorUser}{" "}
          </h1>
          <br />
          <h3 id="vendor-people-fed">
            <div id="vendor-people-fed-count">
              <CountUp duration={5} delay={3} end={this.state.fedCount} />
            </div>
            pounds of food donated
          </h3>
          {this.state.toAddItem ? (
            <AddItemForm
              handleChange={this.handleChange}
              submitItem={this.submitItem}
            />
          ) : (
            this.addItemButton()
          )}
          <br />
        </div>
        <div id="vendor-info-container">
          <div>
            <h1 id="donation-list">Donation List</h1>
            <div id="display-unclaimed-items-container">
              {this.displayUnclaimedItems()}
            </div>
          </div>
          <div>
            <h1 id="claimed-items-list">Claimed Items</h1>
            {this.displayClaimedItems()}
          </div>
        </div>
      </div>
    );
  }
}

export default VendorProfile;
