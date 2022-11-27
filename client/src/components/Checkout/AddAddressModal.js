import { useState } from 'react'

//MUI COMPONENTS
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'

// MUI ICONS
import CloseIcon from '@mui/icons-material/Close'

//REDUX
import { addAddress } from '../../redux/actions/userActions'
import { ADD_ADDRESS_RESET } from '../../redux/constants/userConstants'


const AddAddressModal = () => {

    const { userInfo } = useSelector((state) => state.loginUser)

    const [firstName, setFirstName] = useState(userInfo.firstName)
    const [lastName, setLastName] = useState(userInfo.lastName)
    const [phone, setPhone] = useState("")
    const [phone2, setPhone2] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [street, setStreet] = useState("")
    const [landmark, setLandmark] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        const shippingInfo = { name, email, phone, phone2, state, city, address: street, landmark }

        if(phone.length < 11 || phone.length > 11) {
            alert.error("Phone Number should be 11 digits Long");
            return;
        }

        if(phone2) {
            if(phone2.length < 11 || phone2.length > 11) {
                alert.error("Phone Number should be 11 digits Long");
                return;
            }
        }

        sessionStorage.setItem('shippingAddress', JSON.stringify(shippingInfo))
        dispatch(setShippingAddress(shippingInfo))
        history.push("/checkout/review")
    }

    return (
        <div className="add_address_modal">
            <div className="container">
                <div className="title">
                    <button><CloseIcon /></button>
                    <h1>Add New Address</h1>
                </div>
                <div className="form">
                    {error && <small style={{ color: "tomato", marginBottom: "2rem" }}>{error}</small>}
                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={3} columnSpacing={6}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth 
                                    label="First Name" 
                                    variant="standard" 
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth 
                                    label="Last Name" 
                                    variant="standard" 
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth 
                                    label="Phone" 
                                    variant="standard" 
                                    value={phone}
                                    required
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth 
                                    label="Phone 2" 
                                    variant="standard" 
                                    value={phone2}
                                    onChange={(e) => setPhone2(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth 
                                    label="Address" 
                                    variant="standard" 
                                    value={street}
                                    required
                                    onChange={(e) => setStreet(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth 
                                    label="Nearest landmark" 
                                    variant="standard" 
                                    required
                                    value={landmark}
                                    onChange={(e) => setLandmark(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth 
                                    label="State" 
                                    variant="standard" 
                                    required
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth 
                                    label="City" 
                                    variant="standard" 
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel 
                                    sx={
                                            {
                                                width: '100%',
                                            }
                                        }
                                        control={
                                            <Checkbox 
                                                checked={main}
                                                onChange={(e) => setMain(e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }} 
                                            />
                                        } 
                                        label="Set as default" 
                                />
                            </Grid>
                        </Grid>

                        <Grid container rowSpacing={2} columnSpacing={6} sx={{ mt: 2, '& button': { width: "100%" } }} >
                            <Grid item xs={12}>
                            <LoadingButton
                                endIcon={<SaveIcon />}
                                loading={loading}
                                loadingPosition="end"
                                variant="contained"
                                type="submit"
                            >
                                Save
                            </LoadingButton>
                            </Grid>    
                        </Grid>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddAddressModal