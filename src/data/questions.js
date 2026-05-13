// بنك أسئلة كرة القدم — مقسّم حسب الفئة والصعوبة
// type: 'normal' | 'speed'   difficulty: 1(سهل) 2(متوسط) 3(صعب)

export const questionBank = [
  // ──────────────────────────────────────────────────────
  // كأس العالم
  // ──────────────────────────────────────────────────────
  { id: 'wc1',  category: 'كأس العالم', text: 'كم مرة فازت البرازيل بكأس العالم؟',                                             answer: '5 مرات',                           points: 10, type: 'normal', difficulty: 1 },
  { id: 'wc2',  category: 'كأس العالم', text: 'من هو أكثر لاعب تسجيلاً للأهداف في تاريخ كأس العالم؟',                        answer: 'ميروسلاف كلوزه (16 هدف)',           points: 20, type: 'normal', difficulty: 2 },
  { id: 'wc3',  category: 'كأس العالم', text: 'أين أُقيم كأس العالم 2022؟',                                                   answer: 'قطر',                              points: 10, type: 'speed',  difficulty: 1 },
  { id: 'wc4',  category: 'كأس العالم', text: 'من فاز بكأس العالم 2018؟',                                                     answer: 'فرنسا',                            points: 10, type: 'speed',  difficulty: 1 },
  { id: 'wc5',  category: 'كأس العالم', text: 'في أي عام أُقيم أول كأس عالم؟',                                                answer: '1930',                             points: 15, type: 'normal', difficulty: 2 },
  { id: 'wc6',  category: 'كأس العالم', text: 'من هو أصغر لاعب يسجل هدفاً في كأس العالم؟',                                   answer: 'بيليه (17 عاماً، 1958)',            points: 25, type: 'normal', difficulty: 3 },
  { id: 'wc7',  category: 'كأس العالم', text: 'كم مرة فازت ألمانيا بكأس العالم؟',                                             answer: '4 مرات',                           points: 10, type: 'normal', difficulty: 2 },
  { id: 'wc8',  category: 'كأس العالم', text: 'من فاز بجائزة الكرة الذهبية في مونديال 2022؟',                                 answer: 'ليونيل ميسي',                      points: 10, type: 'speed',  difficulty: 1 },
  { id: 'wc9',  category: 'كأس العالم', text: 'ما هو البلد الذي خسر في نهائي كأس العالم 2022؟',                              answer: 'فرنسا',                            points: 10, type: 'speed',  difficulty: 1 },
  { id: 'wc10', category: 'كأس العالم', text: 'من سجل هاتريك في نهائي كأس العالم 2022؟',                                     answer: 'كيليان مبابي',                     points: 20, type: 'speed',  difficulty: 2 },
  { id: 'wc11', category: 'كأس العالم', text: 'كم هدفاً سُجّل في مباراة البرازيل وألمانيا نصف نهائي 2014؟',                  answer: '8 أهداف (1-7)',                    points: 25, type: 'normal', difficulty: 2 },
  { id: 'wc12', category: 'كأس العالم', text: 'من هو حارس مرمى كأس العالم 2022 الفائز بجائزة أفضل حارس؟',                   answer: 'إيميلانو مارتينيز',               points: 20, type: 'normal', difficulty: 2 },
  { id: 'wc13', category: 'كأس العالم', text: 'من فاز بكأس العالم 2014؟',                                                     answer: 'ألمانيا',                          points: 10, type: 'speed',  difficulty: 1 },
  { id: 'wc14', category: 'كأس العالم', text: 'من فاز بكأس العالم 2010؟',                                                     answer: 'إسبانيا',                          points: 10, type: 'speed',  difficulty: 1 },
  { id: 'wc15', category: 'كأس العالم', text: 'كم فريقاً سيشارك في كأس العالم 2026؟',                                         answer: '48 فريقاً',                        points: 15, type: 'normal', difficulty: 2 },
  { id: 'wc16', category: 'كأس العالم', text: 'من فاز بجائزة أفضل لاعب في كأس العالم 2018؟',                                  answer: 'لوكا مودريتش',                     points: 15, type: 'speed',  difficulty: 2 },
  { id: 'wc17', category: 'كأس العالم', text: 'ما هي أسرع نتيجة انتهت بها مباراة في مونديال واحد (الخسارة الكبرى)؟',          answer: 'ألمانيا 7 - 1 البرازيل (2014)',   points: 20, type: 'normal', difficulty: 2 },
  { id: 'wc18', category: 'كأس العالم', text: 'ما هي الدولة العربية الوحيدة التي فازت على الأرجنتين في كأس عالم؟',            answer: 'السعودية (2022)',                  points: 15, type: 'normal', difficulty: 2 },
  { id: 'wc19', category: 'كأس العالم', text: 'من هو هداف كأس العالم 2014؟',                                                  answer: 'خاميس رودريغيث (6 أهداف)',         points: 20, type: 'normal', difficulty: 2 },
  { id: 'wc20', category: 'كأس العالم', text: 'من هو هداف كأس العالم 2018؟',                                                  answer: 'هاري كين (6 أهداف)',               points: 20, type: 'normal', difficulty: 2 },
  { id: 'wc21', category: 'كأس العالم', text: 'ما هو أسرع هدف في تاريخ كأس العالم؟',                                          answer: 'هاكان شوكور (11 ثانية) لتركيا 2002', points: 25, type: 'normal', difficulty: 3 },
  { id: 'wc22', category: 'كأس العالم', text: 'أين تُقام كأس العالم 2030؟',                                                   answer: 'إسبانيا والمغرب والبرتغال والأرجنتين وأوروغواي', points: 20, type: 'normal', difficulty: 2 },
  { id: 'wc23', category: 'كأس العالم', text: 'من هو صاحب رقم أكثر مشاركات في كأس العالم؟',                                   answer: 'ليونيل ميسي (26 مباراة)',           points: 20, type: 'normal', difficulty: 2 },
  { id: 'wc24', category: 'كأس العالم', text: 'ما هي الدولة التي استضافت كأس العالم 2006؟',                                   answer: 'ألمانيا',                          points: 10, type: 'speed',  difficulty: 1 },
  { id: 'wc25', category: 'كأس العالم', text: 'أين تُقام كأس العالم 2034؟',                                                   answer: 'المملكة العربية السعودية',         points: 10, type: 'speed',  difficulty: 1 },

  // ──────────────────────────────────────────────────────
  // دوري أبطال أوروبا
  // ──────────────────────────────────────────────────────
  { id: 'cl1',  category: 'أبطال أوروبا', text: 'من هو الهداف التاريخي لدوري أبطال أوروبا؟',                                  answer: 'كريستيانو رونالدو (140 هدف)',      points: 10, type: 'normal', difficulty: 1 },
  { id: 'cl2',  category: 'أبطال أوروبا', text: 'كم مرة فاز ريال مدريد بدوري أبطال أوروبا حتى 2024؟',                        answer: '15 مرة',                           points: 20, type: 'normal', difficulty: 2 },
  { id: 'cl3',  category: 'أبطال أوروبا', text: 'من فاز بدوري أبطال أوروبا موسم 2022-2023؟',                                 answer: 'مانشستر سيتي',                     points: 15, type: 'speed',  difficulty: 2 },
  { id: 'cl4',  category: 'أبطال أوروبا', text: 'ما هو الفريق الذي يعرف بـ"الملكي" في أوروبا لكثرة ألقابه؟',                answer: 'ريال مدريد',                       points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl5',  category: 'أبطال أوروبا', text: 'من هو أصغر لاعب يسجل في نهائي أبطال أوروبا؟',                               answer: 'باتريك كلويفرت (18 عاماً)',        points: 30, type: 'normal', difficulty: 3 },
  { id: 'cl6',  category: 'أبطال أوروبا', text: 'أين أُقيم نهائي دوري أبطال أوروبا 2024؟',                                   answer: 'لندن (ويمبلي)',                     points: 15, type: 'speed',  difficulty: 2 },
  { id: 'cl7',  category: 'أبطال أوروبا', text: 'من فاز بنهائي أبطال أوروبا 2024؟',                                           answer: 'ريال مدريد',                       points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl8',  category: 'أبطال أوروبا', text: 'من فاز بدوري أبطال أوروبا 2019؟',                                            answer: 'ليفربول',                          points: 15, type: 'speed',  difficulty: 2 },
  { id: 'cl9',  category: 'أبطال أوروبا', text: 'من فاز بدوري أبطال أوروبا 2021؟',                                            answer: 'تشيلسي',                           points: 15, type: 'speed',  difficulty: 2 },
  { id: 'cl10', category: 'أبطال أوروبا', text: 'أي فريق فاز بثلاثة ألقاب أبطال أوروبا متتالية (2016-2018)؟',                answer: 'ريال مدريد',                       points: 20, type: 'normal', difficulty: 2 },
  { id: 'cl11', category: 'أبطال أوروبا', text: 'من سجل هدف الفوز في نهائي أبطال أوروبا 2024؟',                              answer: 'فيني جونيور',                      points: 20, type: 'normal', difficulty: 2 },
  { id: 'cl12', category: 'أبطال أوروبا', text: 'ما هو أول موسم أُقيمت فيه بطولة دوري أبطال أوروبا بصيغتها الحديثة؟',        answer: '1992-1993',                        points: 25, type: 'normal', difficulty: 3 },
  { id: 'cl13', category: 'أبطال أوروبا', text: 'من هو النادي الإنجليزي الأكثر فوزاً بدوري أبطال أوروبا؟',                   answer: 'ليفربول (6 مرات)',                 points: 20, type: 'normal', difficulty: 2 },
  { id: 'cl14', category: 'أبطال أوروبا', text: 'من فاز بدوري أبطال أوروبا 2020؟',                                            answer: 'بايرن ميونخ',                      points: 15, type: 'speed',  difficulty: 2 },

  // ──────────────────────────────────────────────────────
  // لاعبون
  // ──────────────────────────────────────────────────────
  { id: 'pl1',  category: 'لاعبون', text: 'من هو صاحب أكثر الكرات الذهبية في التاريخ؟',                                       answer: 'ليونيل ميسي (8 كرات)',             points: 10, type: 'normal', difficulty: 1 },
  { id: 'pl2',  category: 'لاعبون', text: 'ما هو الاسم الحقيقي لـ "بيليه"؟',                                                  answer: 'إيدسون أرانتيس دو ناسيمينتو',     points: 25, type: 'normal', difficulty: 3 },
  { id: 'pl3',  category: 'لاعبون', text: 'في أي فريق بدأ رونالدو مسيرته الاحترافية؟',                                        answer: 'سبورتينغ لشبونة',                  points: 15, type: 'speed',  difficulty: 2 },
  { id: 'pl4',  category: 'لاعبون', text: 'ما هو رقم قميص محمد صلاح في ليفربول؟',                                            answer: '11',                               points: 10, type: 'speed',  difficulty: 1 },
  { id: 'pl5',  category: 'لاعبون', text: 'من هو صاحب لقب "الظاهرة"؟',                                                        answer: 'رونالدو البرازيلي',                points: 10, type: 'speed',  difficulty: 1 },
  { id: 'pl6',  category: 'لاعبون', text: 'كم هدفاً سجل ميسي في موسم 2011-2012 مع برشلونة (رقم قياسي)؟',                      answer: '91 هدفاً',                         points: 20, type: 'normal', difficulty: 2 },
  { id: 'pl7',  category: 'لاعبون', text: 'من انتقل بصفقة أغلى في تاريخ كرة القدم حتى 2024؟',                                answer: 'نيمار (222 مليون يورو لـ PSG)',     points: 20, type: 'normal', difficulty: 2 },
  { id: 'pl8',  category: 'لاعبون', text: 'من هو لاعب السعودية الذي يلقب بـ"الأمير"؟',                                       answer: 'ماجد عبدالله',                     points: 15, type: 'normal', difficulty: 2 },
  { id: 'pl9',  category: 'لاعبون', text: 'في أي عام اعتزل رونالدينيو؟',                                                      answer: '2018',                             points: 20, type: 'speed',  difficulty: 2 },
  { id: 'pl10', category: 'لاعبون', text: 'كم كرة ذهبية يملك كريستيانو رونالدو؟',                                             answer: '5 كرات ذهبية',                     points: 10, type: 'speed',  difficulty: 1 },
  { id: 'pl11', category: 'لاعبون', text: 'ما هو رقم قميص كريستيانو رونالدو في النصر السعودي؟',                               answer: '7',                                points: 10, type: 'speed',  difficulty: 1 },
  { id: 'pl12', category: 'لاعبون', text: 'ما هو الاسم الحقيقي لـ رونالدينيو؟',                                               answer: 'رونالدو دو أسيس مورييرا',          points: 20, type: 'normal', difficulty: 3 },
  { id: 'pl13', category: 'لاعبون', text: 'من هو "اللاعب الكامل" في كرة القدم الهولندية؟',                                    answer: 'يوهان كرويف',                      points: 15, type: 'normal', difficulty: 2 },
  { id: 'pl14', category: 'لاعبون', text: 'من هو أكثر لاعب تسجيلاً للأهداف في تاريخ كرة القدم؟',                             answer: 'كريستيانو رونالدو (+900 هدف)',     points: 10, type: 'normal', difficulty: 1 },
  { id: 'pl15', category: 'لاعبون', text: 'ما هو رقم قميص ميسي مع إنتر ميامي؟',                                               answer: '10',                               points: 10, type: 'speed',  difficulty: 1 },
  { id: 'pl16', category: 'لاعبون', text: 'من هو اللاعب الأرجنتيني الملقب بـ"El Fideo" (المعكرونة)؟',                        answer: 'أنخيل دي ماريا',                   points: 20, type: 'normal', difficulty: 2 },
  { id: 'pl17', category: 'لاعبون', text: 'من هو اللاعب الذي سجل هدف "يد الله" في كأس العالم 1986؟',                         answer: 'دييغو مارادونا',                   points: 10, type: 'speed',  difficulty: 1 },
  { id: 'pl18', category: 'لاعبون', text: 'ما جنسية اللاعب كيليان مبابي؟',                                                    answer: 'فرنسية',                           points: 10, type: 'speed',  difficulty: 1 },
  { id: 'pl19', category: 'لاعبون', text: 'من هو أول لاعب سعودي محترف في أوروبا؟',                                            answer: 'سامي الجابر (وولفرهامبتون 1996)',  points: 20, type: 'normal', difficulty: 2 },
  { id: 'pl20', category: 'لاعبون', text: 'في أي عام وُلد كيليان مبابي؟',                                                     answer: '1998',                             points: 10, type: 'speed',  difficulty: 1 },
  { id: 'pl21', category: 'لاعبون', text: 'من هو حارس المرمى الإسباني الملقب بـ"القط"؟',                                     answer: 'إيكر كاسياس',                      points: 15, type: 'normal', difficulty: 2 },
  { id: 'pl22', category: 'لاعبون', text: 'من هو الهداف التاريخي للدوري الإنجليزي الممتاز؟',                                  answer: 'آلان شيرر (260 هدف)',              points: 20, type: 'normal', difficulty: 2 },
  { id: 'pl23', category: 'لاعبون', text: 'من هو المهاجم البلجيكي الملقب بـ"الشيطان الأحمر"؟',                               answer: 'رومانلو لوكاكو',                   points: 15, type: 'normal', difficulty: 2 },
  { id: 'pl24', category: 'لاعبون', text: 'ما هو البلد الأصلي لعائلة مبابي (أبوه من كاميرون وأمه من؟)',                       answer: 'الجزائر',                          points: 20, type: 'normal', difficulty: 2 },
  { id: 'pl25', category: 'لاعبون', text: 'من هو اللاعب المصري المشهور الذي لعب مع روما قبل ليفربول؟',                        answer: 'محمد صلاح',                        points: 10, type: 'speed',  difficulty: 1 },

  // ──────────────────────────────────────────────────────
  // أندية
  // ──────────────────────────────────────────────────────
  { id: 'cl_a1', category: 'أندية', text: 'ما هو الملعب الرسمي لنادي برشلونة؟',                                               answer: 'كامب نو / إستاد أوليمبيك لويس كومبانيس', points: 10, type: 'normal', difficulty: 1 },
  { id: 'cl_a2', category: 'أندية', text: 'ما هو لقب نادي الهلال السعودي؟',                                                   answer: 'سيد العرب / الزعيم',               points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a3', category: 'أندية', text: 'ما اسم ملعب مانشستر يونايتد؟',                                                     answer: 'أولد ترافورد',                      points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a4', category: 'أندية', text: 'ما هو النادي الذي يعرف بـ"السيدة العجوز"؟',                                       answer: 'يوفنتوس',                          points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a5', category: 'أندية', text: 'ما هو لقب نادي النصر السعودي؟',                                                    answer: 'العالمي',                          points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a6', category: 'أندية', text: 'ما هو الفريق الذي يُعرف بـ"الغانيون" في مصر؟',                                    answer: 'الزمالك',                          points: 15, type: 'normal', difficulty: 2 },
  { id: 'cl_a7', category: 'أندية', text: 'ما هو اسم ملعب نادي ريال مدريد؟',                                                  answer: 'سانتياغو برنابيو',                 points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a8', category: 'أندية', text: 'ما هو النادي الإيطالي الملقب بـ"النيراتزوري"؟',                                   answer: 'إنتر ميلان',                       points: 15, type: 'normal', difficulty: 2 },
  { id: 'cl_a9', category: 'أندية', text: 'في أي مدينة يقع نادي البايرن ميونخ؟',                                               answer: 'ميونخ (ألمانيا)',                   points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a10', category: 'أندية', text: 'ما هو اللقب الأكثر فوزاً به في تاريخ الدوري السعودي؟',                           answer: 'الهلال (أكثر من 18 لقباً)',         points: 15, type: 'normal', difficulty: 2 },
  { id: 'cl_a11', category: 'أندية', text: 'ما هو الملعب الرئيسي لنادي الاتحاد السعودي؟',                                    answer: 'ملعب الجوهرة',                     points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a12', category: 'أندية', text: 'ما هو اسم الدوري السعودي الممتاز الحالي (الراعي)؟',                              answer: 'دوري روشن للمحترفين',              points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a13', category: 'أندية', text: 'ما هو الفريق الملقب بـ"الديناميت" في ألمانيا؟',                                   answer: 'بوروسيا دورتموند',                 points: 15, type: 'normal', difficulty: 2 },
  { id: 'cl_a14', category: 'أندية', text: 'ما لون القميص الرئيسي لنادي ميلان؟',                                              answer: 'أحمر وأسود (روسونيري)',            points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a15', category: 'أندية', text: 'ما هو اللقب التاريخي لنادي الاتحاد السعودي؟',                                    answer: 'سيد القرارات',                     points: 10, type: 'speed',  difficulty: 1 },
  { id: 'cl_a16', category: 'أندية', text: 'في أي مدينة سعودية يوجد نادي الاتفاق؟',                                           answer: 'الدمام',                           points: 10, type: 'speed',  difficulty: 1 },

  // ──────────────────────────────────────────────────────
  // أرقام وإحصائيات
  // ──────────────────────────────────────────────────────
  { id: 'st1',  category: 'أرقام وإحصائيات', text: 'ما هو أغلى انتقال في تاريخ الدوري السعودي؟',                             answer: 'نيمار إلى الهلال',                 points: 15, type: 'speed',  difficulty: 2 },
  { id: 'st2',  category: 'أرقام وإحصائيات', text: 'ما هو أكبر فوز في تاريخ كأس العالم؟',                                    answer: 'أستراليا 31 - 0 أمريكا الساموية', points: 25, type: 'normal', difficulty: 3 },
  { id: 'st3',  category: 'أرقام وإحصائيات', text: 'كم طول ملعب كرة القدم القياسي (الحد الأقصى وفق الفيفا)؟',               answer: '110 أمتار',                        points: 15, type: 'normal', difficulty: 2 },
  { id: 'st4',  category: 'أرقام وإحصائيات', text: 'كم دقيقة تستمر مباراة كرة القدم الرسمية؟',                               answer: '90 دقيقة',                         points: 10, type: 'speed',  difficulty: 1 },
  { id: 'st5',  category: 'أرقام وإحصائيات', text: 'ما قطر الكرة الرسمية وفق قوانين الفيفا؟',                                answer: '68-70 سم',                         points: 20, type: 'normal', difficulty: 2 },
  { id: 'st6',  category: 'أرقام وإحصائيات', text: 'كم عدد اللاعبين في فريق كرة القدم أثناء المباراة؟',                      answer: '11 لاعباً',                        points: 10, type: 'speed',  difficulty: 1 },
  { id: 'st7',  category: 'أرقام وإحصائيات', text: 'ما هو الحد الأقصى لعدد التبديلات في مباراة رسمية حالياً؟',               answer: '5 تبديلات',                        points: 10, type: 'speed',  difficulty: 1 },
  { id: 'st8',  category: 'أرقام وإحصائيات', text: 'كم المسافة التي يجري فيها اللاعب في المتوسط خلال مباراة؟',               answer: '10-13 كيلومتر',                   points: 15, type: 'normal', difficulty: 2 },
  { id: 'st9',  category: 'أرقام وإحصائيات', text: 'كم عدد أضلاع كرة القدم (قطع الجلد)؟',                                    answer: '32 قطعة',                          points: 15, type: 'normal', difficulty: 2 },
  { id: 'st10', category: 'أرقام وإحصائيات', text: 'ما هي المسافة بين قائمتَي المرمى (العرض)؟',                              answer: '7.32 متر',                         points: 20, type: 'normal', difficulty: 2 },
  { id: 'st11', category: 'أرقام وإحصائيات', text: 'كم يستغرق ركل ضربة الجزاء (بعد الصافرة) من الوقت؟',                     answer: '6 ثوانٍ كحد أقصى للحارس في قوسه',points: 20, type: 'normal', difficulty: 3 },
  { id: 'st12', category: 'أرقام وإحصائيات', text: 'ما هي سرعة أقوى تسديدة مسجلة في كرة القدم؟',                            answer: '211 كم/ساعة (ريكاردو كواريسما)',   points: 25, type: 'normal', difficulty: 3 },
  { id: 'st13', category: 'أرقام وإحصائيات', text: 'كم عدد الأندية المشاركة في دوري روشن السعودي؟',                          answer: '16 ناديا',                         points: 10, type: 'speed',  difficulty: 1 },

  // ──────────────────────────────────────────────────────
  // مدربون
  // ──────────────────────────────────────────────────────
  { id: 'mg1',  category: 'مدربون', text: 'من هو مدرب ريال مدريد الذي فاز بأكثر ألقاب أبطال أوروبا كمدرب؟',                  answer: 'كارلو أنشيلوتي (4 ألقاب)',         points: 20, type: 'normal', difficulty: 2 },
  { id: 'mg2',  category: 'مدربون', text: 'من قاد ألمانيا للفوز بكأس العالم 2014؟',                                           answer: 'يواكيم لوف',                       points: 10, type: 'speed',  difficulty: 1 },
  { id: 'mg3',  category: 'مدربون', text: 'من هو المدرب الذي يلقب بـ"المعلم"؟',                                               answer: 'جوزيه مورينيو',                    points: 10, type: 'speed',  difficulty: 1 },
  { id: 'mg4',  category: 'مدربون', text: 'من قاد الأرجنتين للفوز بكأس العالم 2022؟',                                         answer: 'ليونيل سكالوني',                   points: 10, type: 'speed',  difficulty: 1 },
  { id: 'mg5',  category: 'مدربون', text: 'من هو المدرب الذي قاد السعودية للفوز على الأرجنتين في كأس العالم 2022؟',           answer: 'إرفي رونار',                       points: 15, type: 'normal', difficulty: 2 },
  { id: 'mg6',  category: 'مدربون', text: 'من هو المدرب الأكثر فوزاً بكأس العالم كمدرب؟',                                    answer: 'ديديه ديشان وفيديريكو بينياسكا (مرتان)', points: 20, type: 'normal', difficulty: 3 },
  { id: 'mg7',  category: 'مدربون', text: 'من هو مدرب ليفربول الحالي؟',                                                        answer: 'آرني سلوت',                        points: 15, type: 'speed',  difficulty: 2 },
  { id: 'mg8',  category: 'مدربون', text: 'من هو المدرب الإسباني الملقب بـ"بيب"؟',                                            answer: 'جوسيب غوارديولا',                  points: 10, type: 'speed',  difficulty: 1 },
  { id: 'mg9',  category: 'مدربون', text: 'في أي نادٍ درّب فيرغسون أطول فترة؟',                                               answer: 'مانشستر يونايتد (27 عاماً)',        points: 15, type: 'normal', difficulty: 2 },
  { id: 'mg10', category: 'مدربون', text: 'من هو مدرب منتخب فرنسا الذي فاز بكأس العالم 2018؟',                               answer: 'ديديه ديشان',                      points: 10, type: 'speed',  difficulty: 1 },
  { id: 'mg11', category: 'مدربون', text: 'من هو المدرب البرازيلي الملقب بـ"الساحر"؟',                                        answer: 'لوسيمبوغو فيليبي سكولاري',         points: 20, type: 'normal', difficulty: 3 },

  // ──────────────────────────────────────────────────────
  // تاريخ كرة القدم
  // ──────────────────────────────────────────────────────
  { id: 'hi1',  category: 'تاريخ', text: 'في أي عام تأسست الفيفا؟',                                                           answer: '1904',                             points: 20, type: 'normal', difficulty: 2 },
  { id: 'hi2',  category: 'تاريخ', text: 'ما هي الدولة التي اخترعت كرة القدم الحديثة؟',                                       answer: 'إنجلترا',                          points: 10, type: 'speed',  difficulty: 1 },
  { id: 'hi3',  category: 'تاريخ', text: 'من هو أول لاعب يفوز بكأس العالم كلاعب ثم كمدرب؟',                                  answer: 'ماريو زاغالو وفرانز بيكنباور',    points: 25, type: 'normal', difficulty: 3 },
  { id: 'hi4',  category: 'تاريخ', text: 'ما اسم المنافسة الأوروبية التي سبقت دوري أبطال أوروبا؟',                            answer: 'كأس الأندية الأوروبية البطلة',     points: 20, type: 'normal', difficulty: 3 },
  { id: 'hi5',  category: 'تاريخ', text: 'في أي عام تأسست كرة القدم السعودية (الاتحاد السعودي)؟',                             answer: '1959',                             points: 20, type: 'normal', difficulty: 2 },
  { id: 'hi6',  category: 'تاريخ', text: 'ما هي الدولة التي فازت بكأس أمم أفريقيا أكثر مرة؟',                                answer: 'مصر (8 مرات)',                      points: 20, type: 'normal', difficulty: 2 },
  { id: 'hi7',  category: 'تاريخ', text: 'في أي عام شارك المنتخب السعودي لأول مرة في كأس العالم؟',                            answer: '1994 (كأس العالم في أمريكا)',      points: 15, type: 'normal', difficulty: 2 },
  { id: 'hi8',  category: 'تاريخ', text: 'ما هي أول بطولة كأس آسيا يفوز بها المنتخب السعودي؟',                               answer: '1984',                             points: 20, type: 'normal', difficulty: 3 },
  { id: 'hi9',  category: 'تاريخ', text: 'من هو الهداف التاريخي لمنتخب المملكة العربية السعودية؟',                            answer: 'ماجد عبدالله',                     points: 15, type: 'normal', difficulty: 2 },
  { id: 'hi10', category: 'تاريخ', text: 'متى تأسس نادي الهلال السعودي؟',                                                     answer: '1957',                             points: 20, type: 'normal', difficulty: 2 },
  { id: 'hi11', category: 'تاريخ', text: 'في أي عام أُقيمت أول بطولة خليجية؟',                                                answer: '1970',                             points: 20, type: 'normal', difficulty: 2 },

  // ──────────────────────────────────────────────────────
  // سرعة — أسئلة خاطفة
  // ──────────────────────────────────────────────────────
  { id: 'sp1',  category: 'سرعة', text: 'ما لون قميص المنتخب البرازيلي الأصلي؟',                                              answer: 'أصفر',                             points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sp2',  category: 'سرعة', text: 'كم عدد دورات كأس الخليج التي فازت بها الكويت؟',                                      answer: '10 مرات (الأكثر)',                  points: 20, type: 'speed',  difficulty: 2 },
  { id: 'sp3',  category: 'سرعة', text: 'ما هو لون بطاقة التحذير في كرة القدم؟',                                              answer: 'أصفر',                             points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sp4',  category: 'سرعة', text: 'كم عدد دورات كأس آسيا التي فاز بها منتخب السعودية؟',                                answer: '3 مرات',                           points: 15, type: 'speed',  difficulty: 2 },
  { id: 'sp5',  category: 'سرعة', text: 'ما لون قميص منتخب إسبانيا الأساسي؟',                                                 answer: 'أحمر',                             points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sp6',  category: 'سرعة', text: 'ما هي عاصمة البرازيل؟',                                                              answer: 'برازيليا',                         points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sp7',  category: 'سرعة', text: 'من هو المدرب الحالي لمنتخب البرازيل؟',                                               answer: 'دورمفال ليتي',                     points: 15, type: 'speed',  difficulty: 2 },
  { id: 'sp8',  category: 'سرعة', text: 'ما هو الفريق الفائز بكأس الخليج الأخيرة (2023)؟',                                   answer: 'العراق',                           points: 15, type: 'speed',  difficulty: 2 },
  { id: 'sp9',  category: 'سرعة', text: 'ما هي جنسية مدرب مانشستر سيتي غوارديولا؟',                                          answer: 'إسبانية',                          points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sp10', category: 'سرعة', text: 'كم يبلغ ارتفاع المرمى الرسمي؟',                                                      answer: '2.44 متر',                         points: 15, type: 'speed',  difficulty: 2 },
  { id: 'sp11', category: 'سرعة', text: 'ما هو اسم جائزة أفضل لاعب في العالم من الفيفا؟',                                    answer: 'جائزة الفيفا للأفضل',              points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sp12', category: 'سرعة', text: 'من هو منتخب القارة التي لم تستضف كأس العالم حتى الآن؟',                             answer: 'أفريقيا (استضافت 2010 جنوب أفريقيا بالفعل) / أستراليا', points: 20, type: 'normal', difficulty: 3 },
  { id: 'sp13', category: 'سرعة', text: 'ما هو الدوري الإنجليزي الممتاز بالإنجليزية؟',                                       answer: 'Premier League',                   points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sp14', category: 'سرعة', text: 'من هو الرئيس الحالي للفيفا؟',                                                        answer: 'جياني إنفانتينو',                  points: 15, type: 'speed',  difficulty: 2 },
  { id: 'sp15', category: 'سرعة', text: 'ما هو النشيد الأكثر ترددا في ملاعب أوروبا؟',                                        answer: 'يو-فا (أبطال أوروبا)',              points: 10, type: 'speed',  difficulty: 1 },

  // ──────────────────────────────────────────────────────
  // دوري سعودي وخليجي
  // ──────────────────────────────────────────────────────
  { id: 'sa1',  category: 'خليجي وسعودي', text: 'ما هو المنتخب الخليجي الأكثر فوزاً بكأس الخليج؟',                           answer: 'الكويت (10 مرات)',                  points: 15, type: 'normal', difficulty: 2 },
  { id: 'sa2',  category: 'خليجي وسعودي', text: 'أين أُقيمت كأس الخليج 25 عام 2023؟',                                        answer: 'البصرة، العراق',                   points: 15, type: 'normal', difficulty: 2 },
  { id: 'sa3',  category: 'خليجي وسعودي', text: 'ما هو أكثر نادٍ سعودي فوزاً بدوري أبطال آسيا؟',                            answer: 'الهلال (4 مرات)',                   points: 20, type: 'normal', difficulty: 2 },
  { id: 'sa4',  category: 'خليجي وسعودي', text: 'من هو أفضل لاعب في الدوري السعودي موسم 2023-2024؟',                         answer: 'كريستيانو رونالدو',                points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sa5',  category: 'خليجي وسعودي', text: 'أي نادٍ سعودي يلعب في مدينة جدة؟',                                          answer: 'الاتحاد والأهلي والاتفاق والوحدة', points: 10, type: 'normal', difficulty: 1 },
  { id: 'sa6',  category: 'خليجي وسعودي', text: 'كم مرة فاز المنتخب السعودي بكأس الخليج؟',                                   answer: '3 مرات',                           points: 15, type: 'speed',  difficulty: 2 },
  { id: 'sa7',  category: 'خليجي وسعودي', text: 'ما هو ملعب مباريات منتخب السعودية الرئيسي في الرياض؟',                      answer: 'ملعب الملك فهد الدولي',            points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sa8',  category: 'خليجي وسعودي', text: 'من انتقل من باريس سان جيرمان إلى نادي الهلال عام 2023؟',                    answer: 'نيمار',                            points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sa9',  category: 'خليجي وسعودي', text: 'في أي عام فاز الهلال بدوري أبطال آسيا آخر مرة؟',                            answer: '2021',                             points: 20, type: 'normal', difficulty: 2 },
  { id: 'sa10', category: 'خليجي وسعودي', text: 'من هو اللاعب الفرنسي الذي انضم لنادي الاتحاد السعودي؟',                     answer: 'كريم بنزيمة',                      points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sa11', category: 'خليجي وسعودي', text: 'ما هو لقب نادي الأهلي السعودي؟',                                            answer: 'النادي الأهلي',                    points: 10, type: 'speed',  difficulty: 1 },
  { id: 'sa12', category: 'خليجي وسعودي', text: 'كم عدد الأندية في الدوري السعودي للمحترفين (روشن)؟',                        answer: '16 نادياً',                        points: 10, type: 'speed',  difficulty: 1 },
]

// ──────────────────────────────────────────────────────
// من أنا؟ — تلميحات تدريجية (whoami)
// points[i] = نقاط الإجابة عند التلميح رقم i
// ──────────────────────────────────────────────────────
export const whoamiBank = [
  {
    id: 'wi1', category: 'من أنا؟', text: 'من أنا؟', answer: 'ليونيل ميسي', type: 'whoami',
    clues: [
      'وُلدت في مدينة روساريو الأرجنتينية عام 1987',
      'عانيت من مشكلة في هرمون النمو وهو ما تكفّل بعلاجه نادٍ أوروبي كبير',
      'فزت بثمانية كرات ذهبية — رقم قياسي في التاريخ',
      'أنا من قاد الأرجنتين للفوز بكأس العالم 2022',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi2', category: 'من أنا؟', text: 'من أنا؟', answer: 'كريستيانو رونالدو', type: 'whoami',
    clues: [
      'وُلدت في جزيرة ماديرا البرتغالية عام 1985',
      'انتقلت من سبورتينغ لشبونة إلى مانشستر يونايتد عام 2003',
      'أنا الهداف التاريخي لدوري أبطال أوروبا',
      'انتقلت إلى نادٍ سعودي مطلع عام 2023',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi3', category: 'من أنا؟', text: 'من أنا؟', answer: 'زين الدين زيدان', type: 'whoami',
    clues: [
      'وُلدت في مرسيليا الفرنسية لأسرة جزائرية الأصل عام 1972',
      'فزت بكأس العالم 1998 وبطولة أوروبا 2000',
      'اشتُهرت بصاروخ رأسي في نهائي أبطال أوروبا 2002',
      'دربت ريال مدريد وفاز بثلاثة ألقاب أبطال أوروبا متتالية',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi4', category: 'من أنا؟', text: 'من أنا؟', answer: 'محمد صلاح', type: 'whoami',
    clues: [
      'وُلدت في نجريج بمحافظة الغربية في مصر عام 1992',
      'انتقلت من بازل إلى تشيلسي ثم فيورنتينا وروما',
      'يُلقّبني الجماهير بـ"الفرعون" و"صاروخ مصر"',
      'أنا أعلى هداف في تاريخ ليفربول من بين اللاعبين المصريين',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi5', category: 'من أنا؟', text: 'من أنا؟', answer: 'ماجد عبدالله', type: 'whoami',
    clues: [
      'وُلدت في مدينة الطائف عام 1959',
      'يُلقّبني جمهوري بـ"الأمير" و"صاروخ الصحراء"',
      'سجّلت أهدافاً تاريخية في كأس العالم 1994',
      'أنا أسطورة نادي النصر السعودي والمنتخب السعودي',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi6', category: 'من أنا؟', text: 'من أنا؟', answer: 'رونالدينيو', type: 'whoami',
    clues: [
      'وُلدت في بورتو أليغري بالبرازيل عام 1980',
      'فزت بكأس العالم 2002 مع البرازيل وعمري 22 عاماً',
      'حزت على الكرة الذهبية مرتين (2004 و2005)',
      'برعت في برشلونة وأسحرت العالم بمهاراتي واحتفالاتي',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi7', category: 'من أنا؟', text: 'من أنا؟', answer: 'كيليان مبابي', type: 'whoami',
    clues: [
      'وُلدت في باريس عام 1998 وبدأت مسيرتي مع موناكو',
      'أصبحت أصغر فرنسي يسجل في كأس العالم عام 2018',
      'سجلت هاتريك في نهائي كأس العالم 2022',
      'انتقلت إلى ريال مدريد صيف 2024',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi8', category: 'من أنا؟', text: 'من أنا؟', answer: 'نيمار', type: 'whoami',
    clues: [
      'وُلدت في موجي داس كروزيس بالبرازيل عام 1992',
      'انتقلت من سانتوس إلى برشلونة عام 2013 بجانب ميسي وسواريز',
      'كنت أغلى لاعب في التاريخ بانتقالي لباريس بـ222 مليون يورو',
      'انتقلت إلى الهلال السعودي عام 2023',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi9', category: 'من أنا؟', text: 'من أنا؟', answer: 'ثيري هنري', type: 'whoami',
    clues: [
      'وُلدت في لي شيسني بفرنسا عام 1977',
      'فزت بكأس العالم 1998 وبطولة أوروبا 2000 مع فرنسا',
      'أصبحت الهداف التاريخي للمنتخب الفرنسي (51 هدفاً)',
      'تألقت مع آرسنال وأصبحت أسطورتهم الأولى',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi10', category: 'من أنا؟', text: 'من أنا؟', answer: 'لوكا مودريتش', type: 'whoami',
    clues: [
      'وُلدت في زادار بكرواتيا عام 1985 في ظروف صعبة إبان الحرب',
      'انتقلت من توتنهام إلى ريال مدريد عام 2012',
      'فزت بأربعة ألقاب أبطال أوروبا مع ريال مدريد',
      'فزت بجائزة أفضل لاعب في كأس العالم 2018 وكسرت هيمنة ميسي ورونالدو',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi11', category: 'من أنا؟', text: 'من أنا؟', answer: 'سامي الجابر', type: 'whoami',
    clues: [
      'وُلدت في الرياض عام 1972',
      'كنت أول لاعب سعودي يحترف في الدوري الإنجليزي (وولفرهامبتون 1996)',
      'سجّلت أهدافاً في مونديال 1994 و1998 و2002',
      'أنا من لاعبي الهلال الأساطير في تاريخ كرة القدم السعودية',
    ],
    points: [40, 30, 20, 10],
  },
  {
    id: 'wi12', category: 'من أنا؟', text: 'من أنا؟', answer: 'كريم بنزيمة', type: 'whoami',
    clues: [
      'وُلدت في ليون الفرنسية عام 1987 لأبوين جزائريين',
      'انتقلت من أولمبيك ليون إلى ريال مدريد عام 2009',
      'فزت بخمسة ألقاب أبطال أوروبا مع ريال مدريد',
      'حزت على جائزة الكرة الذهبية عام 2022 ثم انتقلت إلى الاتحاد السعودي',
    ],
    points: [40, 30, 20, 10],
  },
]

export const categories = [...new Set(questionBank.map(q => q.category))]

export function getQuestionsByCategory(cat) {
  return questionBank.filter(q => q.category === cat)
}

// يستبعد الأسئلة الموجودة بالفعل في الغرفة تجنباً للتكرار
export function getRandomQuestions(count = 10, excludeIds = []) {
  const excludeSet = new Set(excludeIds)
  const pool = questionBank.filter(q => !excludeSet.has(q.id))
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count)
}
