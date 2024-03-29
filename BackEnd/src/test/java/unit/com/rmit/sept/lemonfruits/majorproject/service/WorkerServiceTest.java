package unit.com.rmit.sept.lemonfruits.majorproject.service;

import com.rmit.sept.lemonfruits.majorproject.AbstractBaseTest;
import com.rmit.sept.lemonfruits.majorproject.entity.BusinessHoursEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkerEntity;
import com.rmit.sept.lemonfruits.majorproject.entity.WorkingHoursEntity;
import com.rmit.sept.lemonfruits.majorproject.model.HoursRequest;
import com.rmit.sept.lemonfruits.majorproject.repository.BookingRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.BusinessHoursRepository;
import com.rmit.sept.lemonfruits.majorproject.repository.WorkingHoursRepository;
import com.rmit.sept.lemonfruits.majorproject.service.WorkerService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.web.server.ResponseStatusException;
import unit.com.rmit.sept.lemonfruits.majorproject.UnitTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.isNotNull;
import static org.mockito.Mockito.*;

@UnitTest
public class WorkerServiceTest extends AbstractBaseTest {

    @InjectMocks
    private WorkerService workerService;

    @Mock
    private WorkingHoursRepository workingHoursRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BusinessHoursRepository businessHoursRepository;


    @Test
    public void createWorkerAvailabilityTestInsideBusinessHours() {
        when(workingHoursRepository.isThereOverlapingEntry(isNotNull(), isNotNull(), isNotNull())).thenReturn(null);

        BusinessHoursEntity businessHoursEntity = BusinessHoursEntity.builder()
                .startTime(LocalDateTime.of(2010, 10, 1, 0, 00))
                .endTime(LocalDateTime.of(2010, 10, 1, 23, 00))
                .build();
        when(businessHoursRepository.getBusinessHourThatContainsTime(notNull())).thenReturn(businessHoursEntity);


        HoursRequest hoursRequest = new HoursRequest();
        hoursRequest.setStartTime(LocalDateTime.of(2010, 10, 1, 1, 00));
        hoursRequest.setEndTime(LocalDateTime.of(2010, 10, 1, 2, 00));

        workerService.createAvailability(testWorkerEntity(), hoursRequest);

        verify(workingHoursRepository, atLeastOnce()).save(any());
    }

    @Test
    public void createWorkerAvailabilityTestIncludingInsideBusinessHours() {
        when(workingHoursRepository.isThereOverlapingEntry(isNotNull(), isNotNull(), isNotNull())).thenReturn(null);

        BusinessHoursEntity businessHoursEntity = BusinessHoursEntity.builder()
                .startTime(LocalDateTime.of(2010, 10, 1, 1, 00))
                .endTime(LocalDateTime.of(2010, 10, 1, 2, 00))
                .build();
        when(businessHoursRepository.getBusinessHourThatContainsTime(notNull())).thenReturn(businessHoursEntity);
        HoursRequest hoursRequest = new HoursRequest();
        hoursRequest.setStartTime(LocalDateTime.of(2010, 10, 1, 1, 00));
        hoursRequest.setEndTime(LocalDateTime.of(2010, 10, 1, 2, 00));

        workerService.createAvailability(testWorkerEntity(), hoursRequest);

        verify(workingHoursRepository, atLeastOnce()).save(any());
    }

    @Test
    public void createWorkerAvailabilityTestOutsideBusinessHours() {
        when(workingHoursRepository.isThereOverlapingEntry(isNotNull(), isNotNull(), isNotNull())).thenReturn(null);

        HoursRequest hoursRequest = new HoursRequest();
        hoursRequest.setStartTime(LocalDateTime.of(2010, 10, 1, 1, 00));
        hoursRequest.setEndTime(LocalDateTime.of(2010, 10, 1, 2, 00));

        assertThrows(ResponseStatusException.class, () -> workerService.createAvailability(testWorkerEntity(), hoursRequest));

        verify(workingHoursRepository, never()).save(any());
    }

    @Test
    public void createOverlappingAvailabilityTest() {
        when(workingHoursRepository.isThereOverlapingEntry(isNotNull(), isNotNull(), isNotNull())).thenReturn(new WorkingHoursEntity());

        HoursRequest hoursRequest = new HoursRequest();
        hoursRequest.setStartTime(LocalDateTime.of(2010, 10, 1, 1, 00));
        hoursRequest.setEndTime(LocalDateTime.of(2010, 10, 1, 2, 00));

        assertThrows(ResponseStatusException.class, () -> workerService.createAvailability(testWorkerEntity(), hoursRequest));
    }

    @Test
    public void createInvalidAvailabilityTest() {
        HoursRequest hoursRequest = new HoursRequest();
        hoursRequest.setStartTime(LocalDateTime.of(2010, 10, 1, 2, 00));
        hoursRequest.setEndTime(LocalDateTime.of(2010, 10, 1, 1, 00));

        assertThrows(ResponseStatusException.class, () -> workerService.createAvailability(testWorkerEntity(), hoursRequest));
    }

    @Test
    public void removeAvailabilityTest() {
        WorkerEntity testWorker = testWorkerEntity();

        WorkingHoursEntity workingHoursEntity =
                WorkingHoursEntity.builder()
                        .workerEntity(testWorker)
                        .endTime(LocalDateTime.now().plusDays(2))
                        .startTime(LocalDateTime.now().plusDays(1))
                        .build();

        when(workingHoursRepository.findById(isNotNull())).thenReturn(Optional.of(workingHoursEntity));

        workerService.removeAvailability(testWorker, 1l);

        verify(workingHoursRepository, atLeastOnce()).delete(notNull());
    }

    @Test
    public void removeMissingAvailabilityTest() {
        when(workingHoursRepository.findById(isNotNull())).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> workerService.removeAvailability(testWorkerEntity(), 1l));

        verify(workingHoursRepository, never()).delete(notNull());
    }

    @Test
    public void removeNotOwnedAvailabilityTest() {
        WorkerEntity newTestWorker = new WorkerEntity();
        newTestWorker.setId(2l);

        WorkingHoursEntity workingHoursEntity =
                WorkingHoursEntity.builder()
                        .workerEntity(newTestWorker)
                        .endTime(LocalDateTime.now().plusDays(2))
                        .startTime(LocalDateTime.now().plusDays(1))
                        .build();

        when(workingHoursRepository.findById(isNotNull())).thenReturn(Optional.of(workingHoursEntity));

        assertThrows(ResponseStatusException.class, () -> workerService.removeAvailability(testWorkerEntity(), 1l));

        verify(workingHoursRepository, never()).delete(notNull());
    }

}
