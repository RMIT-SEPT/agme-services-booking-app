package unit.com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.controller.CustomerController;
import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import com.rmit.sept.lemonfruits.majorproject.model.ProfileChangeRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.CustomerRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.UserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import unit.com.rmit.sept.lemonfruits.majorproject.UnitTest;

import java.time.LocalDateTime;
import java.util.*;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.isNotNull;
import static org.mockito.Mockito.*;

@UnitTest
public class CustomerControllerTest {

    @InjectMocks
    private CustomerController customerController;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private CustomerEntity testCustomer;

    @BeforeAll
    public void setUp() {
        testCustomer = new CustomerEntity();
        testCustomer.setUsername("testCustomer");
        testCustomer.setFirstName("testFirst");
        testCustomer.setLastName("testLast");
        testCustomer.setPhoneNumber("000");
        testCustomer.setAddress("aaaa");

        Set<BookingEntity> bookingEntitySet = new LinkedHashSet<>();
        bookingEntitySet.add(
                BookingEntity
                        .builder()
                        .startTime(LocalDateTime.now().plusDays(1))
                        .endTime(LocalDateTime.now().plusDays(2))
                        .build()
        );
        bookingEntitySet.add(
                BookingEntity
                        .builder()
                        .startTime(LocalDateTime.now().plusDays(3))
                        .endTime(LocalDateTime.now().plusDays(4))
                        .build()
        );
        bookingEntitySet.add(
                BookingEntity
                        .builder()
                        .startTime(LocalDateTime.now().minusDays(3))
                        .endTime(LocalDateTime.now().minusDays(4))
                        .build()
        );

        testCustomer.setBookings(bookingEntitySet);
    }


    @Test
    public void getCurrentBookingsTest() {
        ResponseEntity<List<BookingEntity>> response = customerController.viewBookings(testCustomer);

        assertThat(response.getStatusCode(), is(HttpStatus.OK));
        assertThat(response.getBody().size(), is(2));
    }

    @Test
    public void getSomeCurrentBookingsTest() {
        ResponseEntity<List<BookingEntity>> response = customerController.viewPastBookings(testCustomer);

        assertThat(response.getStatusCode(), is(HttpStatus.OK));
        assertThat(response.getBody().size(), is(1));
    }

    @Test
    public void getAvailabilities() {
        List<BookingEntity> bookingEntities = new ArrayList<>();
        bookingEntities.add(
                BookingEntity.builder()
                        .startTime(LocalDateTime.now().plusDays(1))
                        .endTime(LocalDateTime.now().plusDays(2))
                        .customerEntity(null)
                        .build()
        );
        bookingEntities.add(
                BookingEntity.builder()
                        .startTime(LocalDateTime.now().plusDays(1))
                        .endTime(LocalDateTime.now().plusDays(2))
                        .customerEntity(null)
                        .build()
        );

        when(bookingRepository.findByCustomerEntityIsNullAndStartTimeAfter(isNotNull())).thenReturn(bookingEntities);

        ResponseEntity<List<BookingEntity>> availableBooking = customerController.viewAvailableBookings();

        assertThat(availableBooking.getStatusCode(), is(HttpStatus.OK));
        assertThat(availableBooking.getBody().size(), is(2));
    }

    @Test
    public void changeProfile() {
        ProfileChangeRequest profileChangeRequest = new ProfileChangeRequest();
        profileChangeRequest.setFirstName("newTestFirst");

        customerController.editProfile(testCustomer, profileChangeRequest);

        assertThat(testCustomer.getFirstName(), is("newTestFirst"));
        assertThat(testCustomer.getLastName(), is("testLast"));

    }

    @Test
    public void changeProfileInvalidUsername() {
        ProfileChangeRequest profileChangeRequest = new ProfileChangeRequest();
        profileChangeRequest.setUsername("newUsername");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testCustomer));

        assertThrows(ResponseStatusException.class, () -> customerController.editProfile(testCustomer, profileChangeRequest));
    }

    @Test
    public void signUpCustomerTest() {
        CustomerEntity newCustomer = new CustomerEntity();
        newCustomer.setUsername("newTestCustomer");
        newCustomer.setPassword("testPassword");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("ENCODED");

        customerController.signUpCustomer(newCustomer);

        verify(customerRepository, atLeastOnce()).save(any());
        verify(passwordEncoder, atLeastOnce()).encode(anyString());
        assertThat(newCustomer.getPassword(), is(not("testPassword")));

    }

    @Test
    public void signUpInvalidCustomerTest() {
        CustomerEntity newCustomer = new CustomerEntity();
        newCustomer.setUsername("newTestCustomer");
        newCustomer.setPassword("testPassword");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testCustomer));

        assertThrows(ResponseStatusException.class, () -> customerController.signUpCustomer(newCustomer));
    }
}
