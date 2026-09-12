package com.kisanprocure.config;
import com.kisanprocure.entity.enums.Role;
import com.kisanprocure.entity.*; import com.kisanprocure.entity.enums.*;
import com.kisanprocure.repository.*; import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.*; import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.*;

@Configuration
public class DataSeeder {
 @Bean CommandLineRunner seed(UserRepository users, FarmerRepository farmers, OfficerRepository officers, CentreRepository centres, CropRepository crops, CentreCropRepository centreCrops, SlotRepository slots, PasswordEncoder encoder){
  return args->{
   if(users.count()>0) return;
   User fu=users.save(User.builder().name("Demo Farmer").phone("9876543210").email("farmer@demo.com").passwordHash(encoder.encode("123456")).role(Role.FARMER).build());
   farmers.save(Farmer.builder().user(fu).farmerCode("FARM-1001").village("Rampur").district("Munger").state("Bihar").build());
   User ou=users.save(User.builder().name("Demo Officer").phone("9999999999").email("officer@demo.com").passwordHash(encoder.encode("123456")).role(Role.OFFICER).build());
   Centre c=centres.save(Centre.builder().name("Shivpur Procurement Centre").code("SPC-001").address("Shivpur Block, Near Main Road").latitude(25.3701).longitude(86.4702).dailyCapacity(500d).status(CentreStatus.ACTIVE).build());
   Crop p=crops.save(Crop.builder().name("Paddy").unit("quintal").build());
   officers.save(Officer.builder().user(ou).employeeId("EMP-1001").centre(c).build());
   Crop w=crops.save(Crop.builder().name("Wheat").unit("quintal").build());
   centreCrops.save(CentreCrop.builder().centre(c).crop(p).rate(2300d).isAvailable(true).build());
   centreCrops.save(CentreCrop.builder().centre(c).crop(w).rate(2200d).isAvailable(true).build());
   slots.save(Slot.builder().centre(c).slotDate(LocalDate.now().plusDays(1)).startTime(LocalTime.of(8,0)).endTime(LocalTime.of(10,0)).capacity(100d).bookedCapacity(0d).build());
   slots.save(Slot.builder().centre(c).slotDate(LocalDate.now().plusDays(1)).startTime(LocalTime.of(10,0)).endTime(LocalTime.of(12,0)).capacity(100d).bookedCapacity(0d).build());
  }; }
}
