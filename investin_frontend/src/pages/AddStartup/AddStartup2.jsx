import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddStartup = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        companyGovtVerifiedNo: '',
        email: '',
        keyPeople: [{ name: '', position: '', role: '', info: '' }],
        companyInfo: '',
        shareholderPattern: [{ investor: '', holdingPercentage: '' }],
        domain: '',
        clients: [{ clientName: '', work: '', info: '' }],
        interestedVC: '',
        pitch: '',
        contact: '',
        equityOffered: '',
        valuation: '',
        website: '',
        linkedIn: '',
        startupType: 'product',
        stage: 'seed',
        likes: 0
    });

    const [logo, setLogo] = useState(null);
    const [keyPeopleImages, setKeyPeopleImages] = useState([]);
    const [clientImages, setClientImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleArrayChange = (index, arrayName, field, value) => {
        const updatedArray = [...formData[arrayName]];
        updatedArray[index][field] = value;
        setFormData(prevState => ({
            ...prevState,
            [arrayName]: updatedArray
        }));
    };

    const handleFileChange = (e, type, index) => {
        const file = e.target.files[0];
        if (type === 'logo') {
            setLogo(file);
        } else if (type === 'keyPeople') {
            const updatedKeyPeopleImages = [...keyPeopleImages];
            updatedKeyPeopleImages[index] = file;
            setKeyPeopleImages(updatedKeyPeopleImages);
        } else if (type === 'clients') {
            const updatedClientImages = [...clientImages];
            updatedClientImages[index] = file;
            setClientImages(updatedClientImages);
        }
    };

    const handleAddItem = (arrayName, newItem) => {
        setFormData(prevState => ({
            ...prevState,
            [arrayName]: [...prevState[arrayName], newItem]
        }));
        if (arrayName === 'keyPeople') setKeyPeopleImages(prevState => [...prevState, null]);
        if (arrayName === 'clients') setClientImages(prevState => [...prevState, null]);
    };

    const handleRemoveItem = (arrayName, index) => {
        const updatedArray = formData[arrayName].filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            [arrayName]: updatedArray
        }));
        if (arrayName === 'keyPeople') {
            const updatedKeyPeopleImages = keyPeopleImages.filter((_, i) => i !== index);
            setKeyPeopleImages(updatedKeyPeopleImages);
        }
        if (arrayName === 'clients') {
            const updatedClientImages = clientImages.filter((_, i) => i !== index);
            setClientImages(updatedClientImages);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((item, index) => {
                    Object.keys(item).forEach(subKey => {
                        data.append(`${key}[${index}][${subKey}]`, item[subKey]);
                    });
                });
            } else {
                data.append(key, formData[key]);
            }
        });
    
        if (logo) data.append('logo', logo);
        keyPeopleImages.forEach((image, index) => {
            if (image) data.append('keyPeopleImages', image); // Changed here
        });
        clientImages.forEach((image, index) => {
            if (image) data.append('clientImages', image); // Changed here
        });
    
        // Debugging: Log the FormData contents
        console.log("FormData contents:");
        for (let [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            await axios.post('http://localhost:3000/api/startups', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            toast.success('Startup added successfully');
        } catch (error) {
            console.error('Error adding startup:', error);
            toast.error('Failed to add startup');
        }
    };
    
    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Startup</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {[
                    { label: 'Company Name', name: 'companyName', type: 'text' },
                    { label: 'Company Government Verified No', name: 'companyGovtVerifiedNo', type: 'text' },
                    { label: 'Email', name: 'email', type: 'email' },
                    { label: 'Company Info', name: 'companyInfo', type: 'text' },
                    { label: 'Domain', name: 'domain', type: 'text' },
                    { label: 'Contact', name: 'contact', type: 'text' },
                    { label: 'Equity Offered', name: 'equityOffered', type: 'text' },
                    { label: 'Valuation', name: 'valuation', type: 'text' },
                    { label: 'Website', name: 'website', type: 'text' },
                    { label: 'LinkedIn', name: 'linkedIn', type: 'text' },
                ].map(field => (
                    <div className="mb-4" key={field.name}>
                        <label className="block text-gray-700">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                ))}
                <div className="mb-4">
                    <label className="block text-gray-700">Startup Type</label>
                    <select
                        name="startupType"
                        value={formData.startupType}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    >
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Stage</label>
                    <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                    >
                        <option value="pre-seed">Pre-seed</option>
                        <option value="seed">Seed</option>
                        <option value="early">Early</option>
                        <option value="expansion">Expansion</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Logo</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'logo')}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Key People</label>
                    {formData.keyPeople.map((person, index) => (
                        <React.Fragment key={index}>
                            {['name', 'position', 'role', 'info'].map(field => (
                                <input
                                    key={field}
                                    type="text"
                                    name={field}
                                    value={person[field]}
                                    onChange={(e) => handleArrayChange(index, 'keyPeople', field, e.target.value)}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="border rounded p-2 w-full mb-1"
                                    required
                                />
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'keyPeople', index)}
                                className="border rounded p-2 w-full"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveItem('keyPeople', index)}
                                className="text-red-500 mt-2"
                            >
                                Remove
                            </button>
                        </React.Fragment>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('keyPeople', { name: '', position: '', role: '', info: '' })}
                        className="text-blue-500 mt-2"
                    >
                        Add Key Person
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Clients</label>
                    {formData.clients.map((client, index) => (
                        <React.Fragment key={index}>
                            {['clientName', 'work', 'info'].map(field => (
                                <input
                                    key={field}
                                    type="text"
                                    name={field}
                                    value={client[field]}
                                    onChange={(e) => handleArrayChange(index, 'clients', field, e.target.value)}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="border rounded p-2 w-full mb-1"
                                    required
                                />
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'clients', index)}
                                className="border rounded p-2 w-full"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveItem('clients', index)}
                                className="text-red-500 mt-2"
                            >
                                Remove
                            </button>
                        </React.Fragment>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('clients', { clientName: '', work: '', info: '' })}
                        className="text-blue-500 mt-2"
                    >
                        Add Client
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Shareholder Pattern</label>
                    {formData.shareholderPattern.map((shareholder, index) => (
                        <React.Fragment key={index}>
                            {['investor', 'holdingPercentage'].map(field => (
                                <input
                                    key={field}
                                    type="text"
                                    name={field}
                                    value={shareholder[field]}
                                    onChange={(e) => handleArrayChange(index, 'shareholderPattern', field, e.target.value)}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="border rounded p-2 w-full mb-1"
                                    required
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => handleRemoveItem('shareholderPattern', index)}
                                className="text-red-500 mt-2"
                            >
                                Remove
                            </button>
                        </React.Fragment>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('shareholderPattern', { investor: '', holdingPercentage: '' })}
                        className="text-blue-500 mt-2"
                    >
                        Add Shareholder
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Interested VC</label>
                    <input
                        type="text"
                        name="interestedVC"
                        value={formData.interestedVC}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Pitch</label>
                    <input
                        type="text"
                        name="pitch"
                        value={formData.pitch}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddStartup;
