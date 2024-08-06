import React, { useState } from 'react';
import axios from 'axios';

const AddInvestorForm = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        companyGovtVerifiedNo: '',
        briefInfo: '',
        contact: '',
        email: '',
        address: {
            city: '',
            state: '',
            country: '',
            pincode: '',
        },
        likes: 0,
        website: '',
        linkedIn: '',
        logo: null,
        images: [],
        keyPeople: [{ name: '', position: '', info: '' }],
        keyPeopleImages: [],
        companiesInvested: [{ cname: '', info: '', holdingShare: '' }],
        Clogos: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            address: { ...formData.address, [name]: value },
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleImagesChange = (e) => {
        setFormData({ ...formData, images: Array.from(e.target.files) });
    };

    const handleKeyPeopleChange = (index, e) => {
        const { name, value } = e.target;
        const newKeyPeople = [...formData.keyPeople];
        newKeyPeople[index][name] = value;
        setFormData({ ...formData, keyPeople: newKeyPeople });
    };

    const handleKeyPeopleImageChange = (index, e) => {
        const files = e.target.files;
        const newKeyPeopleImages = [...formData.keyPeopleImages];
        newKeyPeopleImages[index] = files[0];
        setFormData({ ...formData, keyPeopleImages: newKeyPeopleImages });
    };

    const handleCompaniesInvestedChange = (index, e) => {
        const { name, value } = e.target;
        const newCompaniesInvested = [...formData.companiesInvested];
        newCompaniesInvested[index][name] = value;
        setFormData({ ...formData, companiesInvested: newCompaniesInvested });
    };

    const handleClogosChange = (index, e) => {
        const files = e.target.files;
        const newClogos = [...formData.Clogos];
        newClogos[index] = files[0];
        setFormData({ ...formData, Clogos: newClogos });
    };

    const addKeyPerson = () => {
        setFormData({
            ...formData,
            keyPeople: [...formData.keyPeople, { name: '', position: '', info: '' }],
            keyPeopleImages: [...formData.keyPeopleImages, null],
        });
    };

    const addCompanyInvested = () => {
        setFormData({
            ...formData,
            companiesInvested: [...formData.companiesInvested, { cname: '', info: '', holdingShare: '' }],
            Clogos: [...formData.Clogos, null],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('companyName', formData.companyName);
        data.append('companyGovtVerifiedNo', formData.companyGovtVerifiedNo);
        data.append('briefInfo', formData.briefInfo);
        data.append('contact', formData.contact);
        data.append('email', formData.email);
        data.append('likes', formData.likes);
        data.append('website', formData.website);
        data.append('linkedIn', formData.linkedIn);

        // Add address fields directly to the FormData
        data.append('address[city]', formData.address.city);
        data.append('address[state]', formData.address.state);
        data.append('address[country]', formData.address.country);
        data.append('address[pincode]', formData.address.pincode);

        if (formData.logo) {
            data.append('logo', formData.logo);
        }

        formData.images.forEach((image) => {
            data.append('images', image);
        });

        formData.keyPeople.forEach((person, index) => {
            data.append(`keyPeople[${index}][name]`, person.name);
            data.append(`keyPeople[${index}][position]`, person.position);
            data.append(`keyPeople[${index}][info]`, person.info);
            if (formData.keyPeopleImages[index]) {
                data.append('keyPeopleImages', formData.keyPeopleImages[index]);
            }
        });

        formData.companiesInvested.forEach((company, index) => {
            data.append(`companiesInvested[${index}][cname]`, company.cname);
            data.append(`companiesInvested[${index}][info]`, company.info);
            data.append(`companiesInvested[${index}][holdingShare]`, company.holdingShare);
            if (formData.Clogos[index]) {
                data.append('Clogos', formData.Clogos[index]);
            }
        });

        try {
            const response = await axios.post('http://localhost:3000/api/investors/add', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials:true
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} />
            <input type="text" name="companyGovtVerifiedNo" placeholder="Government Verified Number" value={formData.companyGovtVerifiedNo} onChange={handleChange} />
            <input type="text" name="briefInfo" placeholder="Brief Info" value={formData.briefInfo} onChange={handleChange} />
            <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleAddressChange} />
            <input type="text" name="state" placeholder="State" value={formData.address.state} onChange={handleAddressChange} />
            <input type="text" name="country" placeholder="Country" value={formData.address.country} onChange={handleAddressChange} />
            <input type="text" name="pincode" placeholder="Pincode" value={formData.address.pincode} onChange={handleAddressChange} />
            <input type="text" name="likes" placeholder="Likes" value={formData.likes} onChange={handleChange} />
            <input type="text" name="website" placeholder="Website" value={formData.website} onChange={handleChange} />
            <input type="text" name="linkedIn" placeholder="LinkedIn" value={formData.linkedIn} onChange={handleChange} />
            <input type="file" name="logo" onChange={handleFileChange} />
            <input type="file" name="images" multiple onChange={handleImagesChange} />
            <div>
                {formData.keyPeople.map((person, index) => (
                    <div key={index}>
                        <input type="text" name="name" placeholder="Name" value={person.name} onChange={(e) => handleKeyPeopleChange(index, e)} />
                        <input type="text" name="position" placeholder="Position" value={person.position} onChange={(e) => handleKeyPeopleChange(index, e)} />
                        <input type="text" name="info" placeholder="Info" value={person.info} onChange={(e) => handleKeyPeopleChange(index, e)} />
                        <input type="file" name={`keyPeopleImages[${index}]`} onChange={(e) => handleKeyPeopleImageChange(index, e)} />
                    </div>
                ))}
                <button type="button" onClick={addKeyPerson}>Add Key Person</button>
            </div>
            <div>
                {formData.companiesInvested.map((company, index) => (
                    <div key={index}>
                        <input type="text" name="cname" placeholder="Company Name" value={company.cname} onChange={(e) => handleCompaniesInvestedChange(index, e)} />
                        <input type="text" name="info" placeholder="Info" value={company.info} onChange={(e) => handleCompaniesInvestedChange(index, e)} />
                        <input type="text" name="holdingShare" placeholder="Holding Share" value={company.holdingShare} onChange={(e) => handleCompaniesInvestedChange(index, e)} />
                        <input type="file" name={`Clogos[${index}]`} onChange={(e) => handleClogosChange(index, e)} />
                    </div>
                ))}
                <button type="button" onClick={addCompanyInvested}>Add Company Invested</button>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddInvestorForm;
