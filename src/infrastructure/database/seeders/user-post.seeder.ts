import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPost } from 'src/domain/entities/user-post.entity';
import { User } from 'src/domain/entities/user.entity';
import { Region } from 'src/domain/entities/region.entity';
import { UserPostPropertyType } from 'src/domain/enums/user-post-property-type.enum';
import { UserPostAdminAgreement } from 'src/domain/enums/user-post-admin-agreement.enum';

@Injectable()
export class UserPostSeeder {
  private readonly logger = new Logger(UserPostSeeder.name);

  constructor(
    @InjectRepository(UserPost)
    private readonly userPostRepo: Repository<UserPost>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
  ) {}

  
  async seed(count = 40) {

    const arabicTitles = [
      'شقة فاخرة في وسط المدينة',
      'فيلا بإطلالة بحرية خلابة',
      'استوديو مناسب للعائلات الصغيرة',
      'عقار استثماري مربح',
      'شقة حديثة قريبة من الخدمات',
      'منزل واسع مع حديقة خاصة',
      'شقة مفروشة بالكامل',
      'شقة للإيجار الشهري',
      'بيت أحلامك في الأحياء الراقية',
      'سكن مريح بأسعار منافسة',
      'فيلا مستقلة بحديقة كبيرة',
      'شقة بإطلالة بانورامية على البحر',
      'منزل ريفي وسط الطبيعة',
      'شقة قريبة من المولات والأسواق',
      'عقار تجاري في موقع حيوي',
      'شقة جديدة لم تسكن من قبل',
      'بيت عائلي واسع في منطقة هادئة',
      'شقة بروف في الطابق الأخير',
      'فيلا حديثة التصميم',
      'شقة دوبلكس بمساحة واسعة',
      'شقة أنيقة بتشطيبات فاخرة',
      'بيت ريفي بإطلالة على الجبال',
      'شقة قريبة من المدارس والمستشفيات',
      'سكن فاخر مع خدمات متكاملة',
      'شقة مريحة للإيجار السنوي',
      'منزل على الطراز الكلاسيكي',
      'شقة في قلب المدينة القديمة',
      'عقار فاخر للمستثمرين',
      'شقة قريبة من وسائل النقل العامة',
      'فيلا مع مسبح خاص',
    ];    

    const arabicDescriptions = [
      'موقع مميز وقريب من جميع المرافق الأساسية، مناسب للعائلات والطلاب.',
      'تصميم مودرن وتشطيب فاخر، يتضمن مطبخ مجهز وغرف واسعة.',
      'مطل على منظر طبيعي خلاب، ويوفر راحة تامة وخصوصية.',
      'فرصة استثمارية نادرة بعائد ممتاز، لا تفوتها.',
      'تتميز هذه الوحدة بالإضاءة الطبيعية والتهوية الجيدة.',
      'يتوفر موقف سيارات وخدمة أمن على مدار الساعة.',
      'قريب من المدارس والمستشفيات والأسواق الكبرى.',
      'مثالي للسكن طويل الأمد أو التأجير الموسمي.',
      'مساحة واسعة تناسب العائلة الكبيرة، مع تقسيم ذكي.',
      'سعر مميز مقابل الجودة، تشطيب راقي ومرافق متكاملة.',
      'شقة جديدة تماماً لم تُستخدم من قبل، جاهزة للسكن فوراً.',
      'توفر إطلالة بانورامية على المدينة، مع بلكونة كبيرة.',
      'بجوار الحدائق العامة والمناطق الخضراء.',
      'تشطيب سوبر لوكس مع أرضيات رخامية.',
      'غرف نوم واسعة مع خزائن مدمجة.',
      'بالقرب من مراكز التسوق الكبرى والمطاعم.',
      'حي هادئ وآمن مع بيئة مثالية للعائلات.',
      'مسافة مشي قصيرة من وسائل النقل العامة.',
      'تصميم ذكي لاستغلال المساحات بشكل مثالي.',
      'إمكانية التقسيط على دفعات ميسرة.',
      'سقف مرتفع وتصميم داخلي عصري.',
      'إطلالة خلابة على البحر أو النهر.',
      'تشطيبات حديثة وألوان مريحة للعين.',
      'أرضية خشبية طبيعية تعطي إحساساً بالدفء.',
      'تدفئة مركزية وتكييف هواء في جميع الغرف.',
      'قريب من المدارس الدولية والجامعات.',
      'حمامات فاخرة بتجهيزات حديثة.',
      'منطقة معيشة مفتوحة ومطبخ أمريكي.',
      'مدخل خاص وحديقة صغيرة أمامية.',
      'سعر منافس مقارنة بالموقع والمميزات.',
    ];

    const users = await this.userRepo.find();
    const regions = await this.regionRepo.find();

    if (users.length === 0 || regions.length === 0) {
      this.logger.warn('No users or regions available to seed UserPosts.');
      return;
    }

    const selectedUsers = faker.helpers.arrayElements(users, Math.min(count, users.length));
    const selectedRegions = faker.helpers.arrayElements(regions, Math.min(count, regions.length));

    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(selectedUsers);
      const region = faker.helpers.arrayElement(selectedRegions);

      const title = faker.helpers.arrayElement(arabicTitles);
      const description = faker.helpers.arrayElements(arabicDescriptions, faker.number.int({ min: 1, max: 2 })).join(' ');

      const budget = faker.number.float({ min: 50000, max: 500000, fractionDigits: 2 });
      const type = faker.helpers.arrayElement(Object.values(UserPostPropertyType)) as UserPostPropertyType;

      const status = UserPostAdminAgreement.ACCEPTED

      const userPost = this.userPostRepo.create({
        user,
        region,
        title,
        description,
        budget,
        type,
        status,
      });

      await this.userPostRepo.save(userPost);
    }

    this.logger.log(`✅ Seeded ${count} user posts.`);
  }
}
