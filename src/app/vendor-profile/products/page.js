"use client";
import { useState,useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

var sampleProducts = [];

export default function InventoryManager() {
  const [products, setProducts] = useState(sampleProducts );
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", price: "", weight: "", stock: "" });
  const [newProduct, setNewProduct] = useState({ name: "", category: "Fruits", price: "", stock: "", weight: "",image:"", description: "" ,vendorId: "" });
  const [vendordetails,setVendordetails] = useState({});
  const filteredProducts = products.filter(
    (p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/vendors/me");
        // setVendordetails(res.data.data);
        setVendordetails(res.data.data)
        
      } catch (error) {
        console.log("Error:", error);
      }
    };
  
    fetchData();
  }, []);

 useEffect(()=>{
  getdata();
 },[vendordetails]);


  const getdata = async ()=>{
    try
    {
      console.log(vendordetails._id)
      const res = await axios.post("/api/vendorsproduct",{vendorId: vendordetails._id});
      console.log(res.data.products);
      setProducts(res.data.products)
    }
    catch(e){
      console.log(e);
    }
     
  }

 
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const pieData = [
    { name: "In Stock", value: inStockCount },
    { name: "Out of Stock", value: outOfStockCount },
  ];

  const COLORS = ["#4CAF50", "#FF5733"];

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditValues({ name: product.name, price: product.price, weight: product.weight, stock: product.stock });
  };

  const handleSave = (id) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...editValues } : p)));
    setEditingProduct(null);
  };

  const handleAddProduct =  async () => {

    console.log("handlkes");
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock ) 
      {
        console.log(newProduct);
        return;
      }

    newProduct.vendorId = vendordetails._id;
    try{
      const res = await axios.post("/api/products",newProduct);
      console.log(res)
    }
    catch{
      console.log("errror")
    }
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setNewProduct({ name: "", category: "Fruits", price: "", stock: "", weight: "", addedBy: "Vendor A" });
    
  };

  return (
 <div className="main-content w-full  p-5 bg-[#FBF9FA] text-[#2B2024]">
      <header className="header flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Inventory Manager</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded"
        />
      </header>
      <div className="flex justify-between mb-5">
        <div className="add-product p-4 bg-white rounded shadow w-2/3">
          <h2 className="text-xl font-bold mb-2">Add New Product</h2>
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Cereals">Cereals</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
           <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="image"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          {/* <input
            type="text"
            placeholder="Weight"
            value={newProduct.weight}
            onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          /> */}
          <button onClick={handleAddProduct} className="px-3 py-1 bg-[#FD0054] cursor-pointer text-white rounded flex items-center gap-1">
            <FaPlus /> Add Product
          </button>
          {/* {vendordetails} */}
        </div>
        <div className="dashboard p-4 bg-white rounded shadow w-1/3">
          <h2 className="text-xl font-bold mb-2">Dashboard</h2>
          <p>Total Products: {totalProducts}</p>
          <p>In Stock: {inStockCount}</p>
          <p>Out of Stock: {outOfStockCount}</p>
          <PieChart width={230} height={230}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
      <div className="category-tabs flex gap-4 mb-4">
        {["All", "Fruits", "Vegetables", "Cereals"].map((cat) => (
          <button
            key={cat}
            className={`p-2 border rounded ${category === cat ? "bg-blue-500 text-white" : "bg-white"}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <section className="product-list grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card bg-white p-4 rounded shadow flex flex-col justify-between">
              <div>
                {editingProduct === product.id ? (
                  <>
                    <input
                      type="text"
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <input
                      type="number"
                      value={editValues.price}
                      onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <input
                      type="text"
                      value={editValues.weight}
                      onChange={(e) => setEditValues({ ...editValues, weight: e.target.value })}
                      className="border p-1 rounded w-full mb-2"
                    />
                    <input
                      type="number"
                      value={editValues.stock}
                      onChange={(e) => setEditValues({ ...editValues, stock: e.target.value })}
                      className="border p-1 rounded w-full mb-2"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                    <p className="text-sm">Category: {product.category}</p>
                    <p className="text-sm">Price: ${product.price}</p>
                    <p className="text-sm">Weight/Quantity: {product.weight || product.stock}</p>
                    <p className={`text-sm font-bold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                    <p className="text-xs text-gray-500">Added by: {product.addedBy}</p>
                  </>
                )}
              </div>
              <div className="flex justify-between mt-3">
                {editingProduct === product.id ? (
                  <button onClick={() => handleSave(product.id)} className="px-3 py-1 bg-green-500 text-white rounded">
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEdit(product)} className="px-3 py-1 bg-yellow-500 text-white rounded flex items-center gap-1">
                    <FaEdit />
                  </button>
                )}
                <button onClick={() => handleDelete(product.id)} className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}