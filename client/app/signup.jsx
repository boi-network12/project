import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import CustomKeyboardView from '../components/customeKeyboard';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
});

const steps = [
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phoneNumber', label: 'Phone Number', type: 'phone' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
];

export default function Signup() {
  const { register } = useAuth();
  const theme = useContext(ThemeContext);
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://api.geonames.org/searchJSON?formatted=true&q=nigeria&maxRows=100&username=kamdi_dev');
        const data = await response.json();

        if (data.geonames) {
          const cityNames = data.geonames.map(city => ({ label: city.name, value: city.name, geonameId: city.geonameId }));
          setCities(cityNames);
        } else {
          console.error('No geonames property in response:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchCities();
  }, []);

  const filteredCities = query ? cities.filter(city =>
    city.label.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <CustomKeyboardView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="auto"/>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.header, { color: theme.text }]}>Sign Up</Text>
          <Text style={[styles.subHeader, { color: theme.text }]}>Create your account</Text>
        </View>
        <Formik
          initialValues={{ firstName: "", lastName: "", email: "", password: "", phoneNumber: "", address: "", city: "" }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await register(values);
              alert('Register Successful!');
            } catch (error) {
              setErrors({ api: error.message });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
            <View style={styles.formContainer}>
              {steps.map((stepInfo, index) => (
                step === index && (
                  stepInfo.name === 'address' ? (
                    <View key={index} style={styles.fieldContainer}>
                      <Text style={[styles.label, { color: "#f2f2f2" }]}>{stepInfo.label}</Text>
                      <TextInput
                        style={[styles.input, { borderColor: theme.text }]}
                        value={query}
                        onChangeText={text => {
                          setQuery(text);
                          setFieldValue(stepInfo.name, text);
                        }}
                        onBlur={() => setFieldValue(stepInfo.name, query)}
                      />
                      <View style={styles.autocompleteContainer}>
                        {filteredCities.map(city => (
                          <TouchableOpacity
                            key={city.geonameId}
                            onPress={() => {
                              setQuery(city.label);
                              setFieldValue('city', city.label);
                            }}
                            style={styles.autocompleteItem}
                          >
                            <Text style={styles.autocompleteText}>{city.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      {errors[stepInfo.name] && touched[stepInfo.name] ? <Text style={styles.error}>{errors[stepInfo.name]}</Text> : null}
                    </View>
                  ) : (
                    <TextInputField
                      key={index}
                      label={stepInfo.label}
                      onChangeText={handleChange(stepInfo.name)}
                      onBlur={handleBlur(stepInfo.name)}
                      value={values[stepInfo.name]}
                      keyboardType={stepInfo.type === 'email' ? 'email-address' : stepInfo.type === 'phone' ? 'phone-pad' : 'default'}
                      secureTextEntry={stepInfo.type === 'password'}
                      error={errors[stepInfo.name] && touched[stepInfo.name] ? errors[stepInfo.name] : ''}
                    />
                  )
                )
              ))}
              {errors.api && <Text style={styles.error}>{errors.api}</Text>}
              <View style={styles.buttonContainer}>
                {step > 0 && (
                  <TouchableOpacity
                    onPress={() => setStep(step - 1)}
                    style={[styles.navButton, styles.shadow, { backgroundColor: theme.secondaryBtn }]}
                  >
                    <Text style={[styles.btnText, { color: "#f2f2f2", fontFamily: "Roboto-Bold" }]}>Back</Text>
                  </TouchableOpacity>
                )}
                {step < steps.length - 1 ? (
                  <TouchableOpacity
                    onPress={() => setStep(step + 1)}
                    style={[styles.btn, styles.shadow, { backgroundColor: theme.primaryBtn }]}
                  >
                    <Text style={[styles.btnText, { color: "#f2f2f2", fontFamily: "Roboto-Bold" }]}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={[styles.btn, styles.shadow, { backgroundColor: theme.primaryBtn }]}
                    disabled={isSubmitting}
                  >
                    <Text style={[styles.btnText, { color: "#f2f2f2", fontFamily: "Roboto-Bold" }]}>
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </CustomKeyboardView>
  );
}

const TextInputField = ({ label, error, ...props }) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: "#f2f2f2" }]}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.text, color: theme.text }]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    width: '100%',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: hp(3),
  },
  header: {
    fontSize: hp(4),
    fontFamily: 'Roboto-Bold',
  },
  subHeader: {
    fontSize: hp(2),
    fontFamily: 'Roboto-Regular',
    color: '#6c6c6c',
  },
  formContainer: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
  },btn: {
    width: wp(80),
    height: hp(7),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: hp(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  navButton: {
    width: wp(35),
    height: hp(7),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  btnText: {
    fontSize: hp(2.5),
    fontFamily: "Roboto-Bold",
  },
  autocompleteContainer: {
    width: '100%',
  },
  autocompleteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  autocompleteText: {
    fontSize: 16,
  },
  autocompleteListContainer: {
    maxHeight: hp(30),
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
});
