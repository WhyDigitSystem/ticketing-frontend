// import React, { useState } from 'react';
import ClearIcon from "@mui/icons-material/Clear";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { default as TextArea, default as TextField } from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import dayjs from "dayjs";
import { useRef, useState, useEffect } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Invoice.css";
import AllPO from "./Allpo";


const Invoice = (addInvoice, viewId) => {
  const [items, setItems] = useState([{ id: 1, description: '', quantity: '', price: '', amount: '' }]);
  const [total, setTotal] = useState(0);
  const [invoiceno, setInvoiceNo] = useState("");
  const [invoiceto, setInvoiceTo] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});


  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [listView, setListView] = useState(false);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const [viewinvoiceData, setViewInvoiceData] = useState("");
  const [showtable, setShowTable] = useState("");
  const [invoiceDetailsDTO, setinvoiceDetailsDTO] = useState("");
  const [InvoiceId, setInvoiceId] = useState("");

  console.log("VIEW ID IS:", viewId);

  const [tableData, setTableData] = useState([
    {
      id: 1,
      column1: "",
      column2: "",
      column3: "",
      column4: "",
    }
  ]);

  const handleItemChange = (id, key, value) => {


    const updatedItems = items.map(item =>
      item.id === id ? { ...item, [key]: value } : item
    );
    setItems(updatedItems);

    console.log("test", updatedItems)
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "invoiceno":
        setInvoiceNo(value);
        break;
      case "invoiceto":
        setInvoiceTo(value);
        break;
      case "address":
        setAddress(value);
        break;
      default:
        break;
    }
  };






  useEffect((viewId) => {
    calculateTotal();
    console.log("VIEW ID IS:", viewId);
  }, [items]);

  useEffect((viewId) => {
    console.log("VIEW ID IS:", viewId);
  }, []);


  // useEffect(() => {
  //   if (viewId) {
  //     viewInvoiceByInvoiceNo();
  //     setShowTable(true);
  //   } else {

  //   }
  // }, [viewId]);

  const calculateTotal = () => {
    let sum = 0;
    items.forEach(item => {
      sum += item.quantity * item.price;
    });
    setTotal(sum);

  };

  const addItem = () => {
    const newId = items.length + 1;

    setItems([...items, { id: newId, description: '', quantity: '', price: '', amount: '' }]);
    setTableData([...tableData, newId]);
  };

  const deleteItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  const handleListViewChange = () => {
    setListView(!listView);
  };

  const handleBack = (row) => {
    setListView(false);
    console.log("Test", row)
    setInvoiceId(row)
    viewInvoiceByInvoiceNo(row)
  };




  const handleInvoice = () => {
    const errors = {};
    if (!invoiceno) {
      errors.invoiceno = "invoiceno is required";
    }
    if (Object.keys(errors).length === 0) {
      const formData = {
        invoiceNo: invoiceno,
        invoiceTo: invoiceto,
        address,
        // total,

        invoiceDetailsDTO: items.map((row) => ({
          description: row.description,
          price: row.price,
          quantity: row.quantity,
          // amount: row.amount,
          // amount: row.quantity * row.price,
          // itemid: row.itemid,
        })),
      };

      axios
        .post(`${process.env.REACT_APP_API_URL}/api/invoice/createinvoice`, formData)
        .then((response) => {
          console.log("Response:", response.data);
          const invoiceId = response.data.paramObjectsMap.InvoiceVO.id;


          setInvoiceNo("");
          setInvoiceTo("");
          setAddress("");
          setTableData({});
          toast.success("invoice Created successfully", {
            autoClose: 2000,
            theme: "colored"
          })
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setErrors(errors);
    }
  };



  const handleInvoiceUpdate = () => {
    const errors = {};
    if (!invoiceno) {
      errors.invoiceno = "invoiceno is required";
    }
    if (Object.keys(errors).length === 0) {
      const formData = {
        invoiceNo: invoiceno,
        invoiceTo: invoiceto,
        address,
        id: InvoiceId,
        // total,

        invoiceDetailsDTO: items.map((row) => ({
          id: row.id,
          description: row.description,
          price: row.price,
          quantity: row.quantity,
          // amount: row.amount,
          // amount: row.quantity * row.price,
          // itemid: row.itemid,
        })),
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/api/invoice/invoice`, formData)
        .then((response) => {
          console.log("Response:", response.data);
          const invoiceId = response.data.paramObjectsMap.InvoiceVO.id;


          setInvoiceNo("");
          setInvoiceTo("");
          setAddress("");
          setTableData({});
          toast.success("invoice Created successfully", {
            autoClose: 2000,
            theme: "colored"
          })
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setErrors(errors);
    }
  };

  const viewInvoiceByInvoiceNo = async (row) => {
    try {

      const response = await axios.get(
        // `${process.env.REACT_APP_API_URL}/api/invoice/getInvoiceById?id=${viewId}`
        (`${process.env.REACT_APP_API_URL}/api/invoice/getInvoiceById?id=${row}`)
      );
      if (response.status === 200) {
        setViewInvoiceData(response.data.paramObjectsMap.InvoiceVO);
        console.log(
          "API Response:",
          response.data.paramObjectsMap.invoiceVO.invoiceNo
        );
        setInvoiceNo(response.data.paramObjectsMap.invoiceVO.invoiceNo);
        setInvoiceTo(
          response.data.paramObjectsMap.invoiceVO.invoiceTo
        );
        setAddress(
          response.data.paramObjectsMap.invoiceVO.address
        );
        setItems(
          response.data.paramObjectsMap.invoiceVO.invoiceDetailsVO
        )

      } else {
        console.error("API Error:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>


      {!listView ? (

        <div className="card w-full p-3 bg-base-100 shadow-lg customized-container">
          <div className="row d-flex" style={{ padding: "20px 20px 0px 20px" }}>

            {/* <div class="l-inner">
            <div class="p-text-box"><h3>Invoice</h3></div>
          </div> */}
            <div class="wrapper">
              <div class="heading-secondary"><h3>Invoice</h3></div>
            </div>


            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div className="card w-full p-3 bg-base-100 shadow-lg ">
              <div className="row d-flex" style={{ padding: "20px 20px 0px 20px" }}>

                <div className="col-md-4 mb-3">


                  <TextField
                    id="outlined-textarea"
                    onChange={handleInputChange}
                    label="Invoice No"
                    name="invoiceno"
                    value={invoiceno}
                    placeholder=""
                    multiline
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <TextField
                    id="Old Rate"
                    name="invoiceto"
                    label="Invoice To"
                    value={invoiceto}
                    onChange={handleInputChange}
                    placeholder=""
                    multiline
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </div>

                <div className="col-md-4 mb-4">
                  <TextArea
                    rows={4}
                    cols={40}
                    id="Old Rate"
                    name="address"
                    label="Address"
                    value={address}
                    onChange={handleInputChange}
                    placeholder=""
                    multiline
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </div>
              </div>
            </div>


            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <div>
              {/* <div class="l-inner"> */}
              <div class="wrapper">
                <div class="heading-secondary"><h2>Line Items</h2></div>
              </div>
              {/* </div> */}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {


                    items && items.map(item => (

                      <tr key={item.id}>
                        <td>

                          <div >
                            <TextField
                              id="outlined-textarea"
                              type="text"
                              value={item.description}
                              placeholder="Description"
                              onChange={(e) => setDescription(handleItemChange(item.id, 'description', e.target.value))}
                              multiline
                              // onChange={(e) => setTableData((prev) =>
                              //   prev.map((r) =>
                              //     r.id === item.id
                              //       ? { ...r, description: e.target.value }
                              //       : r
                              //   )
                              // )
                              // }
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </div>

                        </td>
                        <td>
                          <div >
                            <TextField
                              id="outlined-textarea"
                              type="number"
                              value={item.quantity}
                              placeholder="Quantity"
                              onChange={(e) => setQuantity(handleItemChange(item.id, 'quantity', parseInt(e.target.value)))}
                              multiline
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </div>
                        </td>

                        <td>
                          <div >
                            <TextField
                              id="outlined-textarea"
                              type="number"
                              value={item.price}
                              placeholder="Price"
                              onChange={(e) => setPrice(handleItemChange(item.id, 'price', parseInt(e.target.value)))}
                              multiline
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </div>
                        </td>

                        <td>
                          <div >
                            <TextField
                              id="outlined-textarea"
                              // label="Total"
                              type="number"
                              value={item.quantity * item.price}
                              placeholder="Amount"
                              onChange={(e) => setAmount(handleItemChange(item.id, 'amount', e.target.value))}
                              multiline
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </div>
                        </td>


                        <td>
                          <button className="btn btn-danger" onClick={() => deleteItem(item.id)} >-</button>

                        </td>
                      </tr>



                    )

                    )


                  }

                </tbody>
              </table>

              <hr></hr>
              <button className="btn btn-success col-sm-1" onClick={addItem} >+</button>
              <h4>Total Amount: {total}</h4>
              <Tooltip title="Save" placement="top">
                <SaveIcon size="2rem" stroke={1.5} onClick={handleInvoice} />
              </Tooltip>



              <Tooltip title="List View" placement="top">
                <FormatListBulletedTwoToneIcon
                  size="2rem"
                  stroke={1.5}
                  onClick={handleListViewChange}
                />
              </Tooltip>

              <Tooltip title="Update" placement="top">
                <SaveIcon size="2rem" stroke={1.5} onClick={handleInvoiceUpdate} />
              </Tooltip>
              <div className="d-flex flex-row">
                <Link to="/dashboard/default">
                  <FaArrowCircleLeft
                    className="cursor-pointer w-8 h-8"
                    style={{
                      position: "absolute",
                      left: 950,
                      fontSize: "40px"
                    }}
                  />
                </Link>
              </div>

            </div >

          </div >
        </div >

      ) : (
        <AllPO
          view={handleBack}
          listView={listView}
          hideStatus={userType === "Customer" ? true : ""}

        />
      )}

    </>

  )
}



export default Invoice;
