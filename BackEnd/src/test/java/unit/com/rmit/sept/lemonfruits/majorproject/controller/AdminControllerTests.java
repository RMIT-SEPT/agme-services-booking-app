package unit.com.rmit.sept.lemonfruits.majorproject.controller;

import com.rmit.sept.lemonfruits.majorproject.AbstractBaseTest;
import com.rmit.sept.lemonfruits.majorproject.entity.*;
import com.rmit.sept.lemonfruits.majorproject.model.BookingRequest;
import com.rmit.sept.lemonfruits.majorproject.model.BusinessHoursRequest;
import com.rmit.sept.lemonfruits.majorproject.model.WorkerChangeRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.BusinessHoursRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.WorkerRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.WorkingHoursRepository;
import com.rmit.sept.lemonfruits.majorproject.service.AdminService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import unit.com.rmit.sept.lemonfruits.majorproject.UnitTest;

import java.time.LocalDateTime;
import java.util.*;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.*;

@UnitTest
public class AdminControllerTests extends AbstractBaseTest {

    @InjectMocks
    private AdminService adminService;

    @Mock
    private WorkerRepository workerRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private BusinessHoursRepository businessHoursRepository;

    @Mock
    private WorkingHoursRepository workingHoursRepository;


    @Test
    public void adminProfileTest() {
        AdminEntity testAdmin = testAdminEntity();

        AdminEntity adminEntity = adminService.getProfile(testAdmin);

        assertThat(adminEntity, is(testAdmin));
        assertThat(adminEntity.getAdminId(), is(testAdmin.getAdminId()));
    }

    @Test
    public void adminWorkersTest() {
        WorkerEntity testWorker = testWorkerEntity();
        when(workerRepository.findAll()).thenReturn(Collections.singletonList(testWorker));

        List<WorkerEntity> workers = adminService.seeWorkers();

        assertThat(workers.size(), is(1));
        assertThat(workers.get(0), is(testWorker));
    }

    @Test
    public void adminCreateWorkerTest() {
        when(workerRepository.getByUsername(anyString())).thenReturn(Optional.empty());

        WorkerEntity testWorker = testWorkerEntity();
        testWorker.setId(null);

        WorkerEntity returnedWorker = adminService.createWorker(testWorker);

        assertThat(returnedWorker.getUsername(), is(testWorker.getUsername()));
        assertThat(returnedWorker.getRole(), is(testWorker.getRole()));
        verify(workerRepository, atLeastOnce()).save(any());
    }

    @Test
    public void adminCreateWorkerIdTakenTest() {
        WorkerEntity testWorker = testWorkerEntity();

        assertThrows(ResponseStatusException.class, () -> adminService.createWorker(testWorker));
        verify(workerRepository, never()).save(any());
    }

    @Test
    public void adminCreateWorkerUsernameTakenTest() {
        when(workerRepository.getByUsername(anyString())).thenReturn(Optional.of(testWorkerEntity()));

        WorkerEntity testWorker = testWorkerEntity();
        testWorker.setId(null);

        assertThrows(ResponseStatusException.class, () -> adminService.createWorker(testWorker));
        verify(workerRepository, never()).save(any());
    }

    @Test
    public void adminCreateWorkerRoleNotSetTest() {
        when(workerRepository.getByUsername(anyString())).thenReturn(Optional.empty());

        WorkerEntity testWorker = testWorkerEntity();
        testWorker.setId(null);
        testWorker.setRole(null);


        assertThrows(ResponseStatusException.class, () -> adminService.createWorker(testWorker));
        verify(workerRepository, never()).save(any());
    }

    @Test
    public void editWorkerTest() {
        WorkerChangeRequest request = new WorkerChangeRequest();
        request.setFirstName("newFirstName");

        WorkerEntity testWorker = testWorkerEntity();

        when(workerRepository.getOne(anyLong())).thenReturn(testWorker);
        adminService.editWorker(1l, request);

        assertThat(testWorker.getFirstName(), is("newFirstName"));
        verify(workerRepository, atLeastOnce()).save(any());
    }

    @Test
    public void editNullWorkerTest() {
        WorkerChangeRequest request = new WorkerChangeRequest();
        request.setFirstName("newFirstName");

        when(workerRepository.getOne(anyLong())).thenReturn(null);

        assertThrows(ResponseStatusException.class, () -> adminService.editWorker(1l, request));
        verify(workerRepository, never()).save(any());
    }

    @Test
    public void editTakenUsernameTest() {
        WorkerChangeRequest request = new WorkerChangeRequest();
        request.setUsername("newFirstName");

        WorkerEntity testWorker = testWorkerEntity();

        when(workerRepository.getOne(anyLong())).thenReturn(testWorker);
        when(workerRepository.getByUsername(anyString())).thenReturn(Optional.of(testWorkerEntity()));

        assertThrows(ResponseStatusException.class, () -> adminService.editWorker(1l, request));
        verify(workerRepository, never()).save(any());
    }

    @Test
    public void deleteWorkerTest() {
        when(workerRepository.getOne(anyLong())).thenReturn(testWorkerEntity());

        adminService.deleteWorker(1l);

        verify(workerRepository, atLeastOnce()).delete(any());
    }

    @Test
    public void deleteNullWorkerTest() {
        when(workerRepository.getOne(anyLong())).thenReturn(null);

        assertThrows(ResponseStatusException.class, () -> adminService.deleteWorker(1l));

        verify(workerRepository, never()).delete(any());
    }

    @Test
    public void seeWorkerHoursTest() {
        WorkerEntity workerEntity = testWorkerEntity();
        workerEntity.setWorkingHours(Collections.singleton(
                WorkingHoursEntity.builder()
                        .startTime(LocalDateTime.now())
                        .endTime(LocalDateTime.now().plusHours(1))
                        .workerEntity(workerEntity)
                        .entryId(1l).build()
        ));
        when(workerRepository.getOne(anyLong())).thenReturn(workerEntity);

        Set<WorkingHoursEntity> workingHoursEntities = adminService.seeWorkerHours(1l);

        assertThat(workingHoursEntities, is(not(nullValue())));
        assertThat(workingHoursEntities.size(), is(1));
    }

    @Test
    public void seeNullWorkerHoursTest() {
        when(workerRepository.getOne(anyLong())).thenReturn(null);

        assertThrows(ResponseStatusException.class, () -> adminService.deleteWorker(1l));
    }

    @Test
    public void makeBookingTest() {
        BookingRequest bookingRequest = testBookingRequest();
        bookingRequest.setWorkerId(1l);

        when(workerRepository.findById(anyLong())).thenReturn(Optional.of(testWorkerEntity()));
        when(workingHoursRepository.isThereOverlapingEntry(any(), any(), any())).thenReturn(WorkingHoursEntity.builder()
                .entryId(1l)
                .startTime(LocalDateTime.now().minusHours(1))
                .endTime(LocalDateTime.now().plusHours(2)).build());

        adminService.makeBooking(bookingRequest);

        verify(bookingRepository, atLeastOnce()).save(any());
    }

    @Test
    public void makeBookingEndBeforeStart() {
        BookingRequest bookingRequest = testBookingRequest();
        bookingRequest.setWorkerId(1l);
        bookingRequest.setEndTime(LocalDateTime.now());
        bookingRequest.setStartTime(LocalDateTime.now().plusHours(1));

        assertThrows(ResponseStatusException.class, () -> adminService.makeBooking(bookingRequest));

        verify(bookingRepository, never()).save(any());

    }


    public void makeBookingWorkerTaken() {

    }

    @Test
    public void assignWorkerToBookingTest() {
        WorkerEntity workerEntity = testWorkerEntity();
        BookingEntity bookingEntity = testBookingEntity();

        when(bookingRepository.getOne(anyLong())).thenReturn(bookingEntity);
        when(workerRepository.findById(anyLong())).thenReturn(Optional.of(workerEntity));

        adminService.assignWorkerToBooking(1l, 1l);

        assertThat(bookingEntity.getWorkerEntity(), is(workerEntity));
        verify(bookingRepository, atLeastOnce()).save(any());
    }

    @Test
    public void assignWorkerToBookingNullBookingTest() {
        WorkerEntity workerEntity = testWorkerEntity();

        when(bookingRepository.getOne(anyLong())).thenReturn(null);
        when(workerRepository.findById(anyLong())).thenReturn(Optional.of(workerEntity));

        assertThrows(ResponseStatusException.class, () -> adminService.assignWorkerToBooking(1l, 1l));

        verify(bookingRepository, never()).save(any());
    }

    @Test
    public void assignWorkerToBookingNullWorkerTest() {
        when(workerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> adminService.assignWorkerToBooking(1l, 1l));

        verify(bookingRepository, never()).save(any());
    }

    @Test
    public void seeUpcomingBookingsTest() {
        List<BookingEntity> bookingEntities = new ArrayList<>();

        BookingEntity upcomingBooking = testBookingEntity();
        bookingEntities.add(upcomingBooking);

        BookingEntity pastBooking = testBookingEntity();
        pastBooking.setStartTime(LocalDateTime.now().minusHours(3));
        pastBooking.setEndTime(LocalDateTime.now().minusHours(2));
        bookingEntities.add(pastBooking);

        when(bookingRepository.findAll()).thenReturn(bookingEntities);

        List<BookingEntity> returnEntities = adminService.seeBookings();

        assertThat(returnEntities.isEmpty(), is(false));
        assertThat(returnEntities.size(), is(1));
        assertThat(returnEntities.get(0).getBookingId(), is(upcomingBooking.getBookingId()));
    }

    @Test
    public void seePastBookingsTest() {
        List<BookingEntity> bookingEntities = new ArrayList<>();

        BookingEntity upcomingBooking = testBookingEntity();
        bookingEntities.add(upcomingBooking);

        BookingEntity pastBooking = testBookingEntity();
        pastBooking.setStartTime(LocalDateTime.now().minusHours(3));
        pastBooking.setEndTime(LocalDateTime.now().minusHours(2));
        bookingEntities.add(pastBooking);

        when(bookingRepository.findAll()).thenReturn(bookingEntities);

        List<BookingEntity> returnEntities = adminService.seeBookingHistory();

        assertThat(returnEntities.isEmpty(), is(false));
        assertThat(returnEntities.size(), is(1));
        assertThat(returnEntities.get(0).getBookingId(), is(pastBooking.getBookingId()));

    }

    @Test
    public void deleteBookingTest() {
        when(bookingRepository.findById(anyLong())).thenReturn(Optional.of(testBookingEntity()));

        adminService.deleteBooking(1l);

        verify(bookingRepository, atLeastOnce()).delete(any());
    }

    @Test
    public void deleteNullBookingTest() {
        when(bookingRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> adminService.deleteBooking(1l));

        verify(bookingRepository, never()).delete(any());
    }

    @Test
    public void getBusinessHoursTest() {
        when(businessHoursRepository.findAll()).thenReturn(testBusinessHours());

        List<BusinessHoursEntity> returnHours = adminService.getBusinessHours();

        assertThat(returnHours.isEmpty(), is(false));
        assertThat(returnHours.size(), is(2));
    }

    @Test
    public void setBusinessHoursTest() {
        BusinessHoursRequest request = testBusinessHoursRequest();

        when(businessHoursRepository.isThereOverlapingEntry(any(), any())).thenReturn(Collections.emptyList());

        adminService.setBusinessHours(request);

        verify(businessHoursRepository, atLeastOnce()).save(any());
    }

    @Test
    public void setOverlappingBusinessHoursTest() {
        BusinessHoursRequest request = testBusinessHoursRequest();

        when(businessHoursRepository.isThereOverlapingEntry(any(), any())).thenReturn(Collections.singletonList(testUpcomingBusinessHours()));

        assertThrows(ResponseStatusException.class, () -> adminService.setBusinessHours(request));
        verify(businessHoursRepository, never()).save(any());
    }

    @Test
    public void deleteBusinessHoursTest() {
        when(businessHoursRepository.findById(anyLong())).thenReturn(Optional.of(testUpcomingBusinessHours()));
        when(bookingRepository.getOverlapingBookings(any(), any())).thenReturn(Collections.emptyList());

        adminService.deleteBusinessHours(1l);

        verify(businessHoursRepository, atLeastOnce()).delete(any());
    }

    @Test
    public void deletePastBusinessHoursTest() {
        when(businessHoursRepository.findById(anyLong())).thenReturn(Optional.of(testPastBusinessHours()));

        assertThrows(ResponseStatusException.class, () -> adminService.deleteBusinessHours(1l));

        verify(businessHoursRepository, never()).delete(any());
    }

    @Test
    public void deleteBusinessHoursWithSetBookingTest() {
        when(businessHoursRepository.findById(anyLong())).thenReturn(Optional.of(testUpcomingBusinessHours()));
        when(bookingRepository.getOverlapingBookings(any(), any())).thenReturn(Collections.singletonList(testBookingEntity()));

        assertThrows(ResponseStatusException.class, () -> adminService.deleteBusinessHours(1l));

        verify(businessHoursRepository, never()).delete(any());
    }


}
