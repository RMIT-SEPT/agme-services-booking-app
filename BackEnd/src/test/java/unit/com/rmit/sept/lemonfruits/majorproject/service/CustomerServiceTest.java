package unit.com.rmit.sept.lemonfruits.majorproject.service;

import com.rmit.sept.lemonfruits.majorproject.AbstractBaseTest;
import com.rmit.sept.lemonfruits.majorproject.entity.BookingEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.CustomerEntity;
import com.rmit.sept.lemonfruits.majorproject.model.ProfileChangeRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.CustomerRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.UserRepository;
import com.rmit.sept.lemonfruits.majorproject.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import unit.com.rmit.sept.lemonfruits.majorproject.UnitTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.isNotNull;
import static org.mockito.Mockito.*;

@UnitTest
public class CustomerServiceTest extends AbstractBaseTest {

    @InjectMocks
    private CustomerService customerService;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PasswordEncoder passwordEncoder;


    @Test
    public void getCurrentBookingsTest() {
        CustomerEntity testCustomer = testCustomer();
        testCustomer.setBookings(testBookingList());

        List<BookingEntity> response = customerService.viewBookings(testCustomer);

        assertThat(response.size(), is(2));
    }

    @Test
    public void getSomeCurrentBookingsTest() {
        CustomerEntity testCustomer = testCustomer();
        testCustomer.setBookings(testBookingList());

        List<BookingEntity> response = customerService.viewPastBookings(testCustomer);

        assertThat(response.size(), is(1));
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

        List<BookingEntity> availableBooking = customerService.viewAvailableBookings();

        assertThat(availableBooking.size(), is(2));
    }

    @Test
    public void changeProfile() {
        CustomerEntity testCustomer = testCustomer();

        ProfileChangeRequest profileChangeRequest = new ProfileChangeRequest();
        profileChangeRequest.setFirstName("newTestFirst");

        customerService.editProfile(testCustomer, profileChangeRequest);

        assertThat(testCustomer.getFirstName(), is("newTestFirst"));
        assertThat(testCustomer.getLastName(), is("testLast"));

    }

    @Test
    public void changeProfileInvalidUsername() {
        CustomerEntity testCustomer = testCustomer();

        ProfileChangeRequest profileChangeRequest = new ProfileChangeRequest();
        profileChangeRequest.setUsername("newUsername");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testCustomer));

        assertThrows(ResponseStatusException.class, () -> customerService.editProfile(testCustomer, profileChangeRequest));
    }

    @Test
    public void signUpCustomerTest() {
        CustomerEntity newCustomer = new CustomerEntity();
        newCustomer.setUsername("newTestCustomer");
        newCustomer.setPassword("testPassword");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("ENCODED");

        customerService.signUpCustomer(newCustomer);

        verify(customerRepository, atLeastOnce()).save(any());
        verify(passwordEncoder, atLeastOnce()).encode(anyString());
        assertThat(newCustomer.getPassword(), is(not("testPassword")));

    }

    @Test
    public void signUpInvalidCustomerTest() {
        CustomerEntity newCustomer = new CustomerEntity();
        newCustomer.setUsername("newTestCustomer");
        newCustomer.setPassword("testPassword");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testCustomer()));

        assertThrows(ResponseStatusException.class, () -> customerService.signUpCustomer(newCustomer));
    }
}
