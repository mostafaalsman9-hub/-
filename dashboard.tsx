import { useState } from "react";
import { useListAnnouncements, useListVideos, useListPdfs, useListCourses } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Video, FileText, BookOpen, ExternalLink, Download, Play } from "lucide-react";

function getVideoEmbedUrl(url: string, source: string) {
  if (source === "youtube") {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    if (url.includes("youtube.com/embed/")) return url;
  }
  if (source === "googledrive") {
    const match = url.match(/\/d\/([\w-]+)/);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    return url;
  }
  return null;
}

export default function Dashboard() {
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(undefined);

  const { data: announcements, isLoading: loadingAnnouncements } = useListAnnouncements();
  const { data: courses, isLoading: loadingCourses } = useListCourses();
  const { data: videos, isLoading: loadingVideos } = useListVideos(
    selectedCourse ? { courseId: selectedCourse } : {}
  );
  const { data: pdfs, isLoading: loadingPdfs } = useListPdfs(
    selectedCourse ? { courseId: selectedCourse } : {}
  );

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">لوحة الطالب</h1>
            <p className="text-muted-foreground">اطلع على كل المحتوى التعليمي والإعلانات</p>
          </div>

          <Tabs defaultValue="announcements">
            <TabsList className="mb-6 w-full justify-start flex-wrap h-auto gap-1">
              <TabsTrigger value="announcements" className="gap-2">
                <Megaphone className="h-4 w-4" />
                الإعلانات
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                الفيديوهات
              </TabsTrigger>
              <TabsTrigger value="pdfs" className="gap-2">
                <FileText className="h-4 w-4" />
                ملفات PDF
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2">
                <BookOpen className="h-4 w-4" />
                الكورسات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcements">
              <div className="space-y-4">
                {loadingAnnouncements ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </CardHeader>
                      <CardContent><Skeleton className="h-16 w-full" /></CardContent>
                    </Card>
                  ))
                ) : !announcements?.length ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Megaphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">لا توجد إعلانات حالياً</p>
                    </CardContent>
                  </Card>
                ) : (
                  announcements.map((ann) => (
                    <Card key={ann.id} className="overflow-hidden transition-shadow hover:shadow-md">
                      {ann.imageUrl && (
                        <div className="relative h-48 overflow-hidden">
                          <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{ann.title}</CardTitle>
                          <Badge variant="outline" className="text-xs whitespace-nowrap mr-2">
                            {new Date(ann.createdAt).toLocaleDateString("ar-EG")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{ann.content}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant={selectedCourse === undefined ? "default" : "outline"} size="sm" onClick={() => setSelectedCourse(undefined)}>الكل</Button>
                {courses?.map((c) => (
                  <Button key={c.id} variant={selectedCourse === c.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCourse(c.id)}>{c.name}</Button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6">
                {loadingVideos ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="h-64 w-full rounded-t-lg" />
                      <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
                    </Card>
                  ))
                ) : !videos?.length ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">لا توجد فيديوهات</p>
                    </CardContent>
                  </Card>
                ) : (
                  videos.map((video) => {
                    const embedUrl = getVideoEmbedUrl(video.url, video.source);
                    return (
                      <Card key={video.id} className="overflow-hidden transition-shadow hover:shadow-md">
                        {embedUrl ? (
                          <div className="relative aspect-video">
                            <iframe src={embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                          </div>
                        ) : (
                          <div className="h-32 bg-muted flex items-center justify-center">
                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                              <Play className="h-5 w-5" /> فتح الفيديو <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{video.title}</CardTitle>
                            <div className="flex gap-2">
                              {video.courseName && <Badge variant="secondary">{video.courseName}</Badge>}
                              <Badge variant="outline">{video.source}</Badge>
                            </div>
                          </div>
                          {video.description && <CardDescription>{video.description}</CardDescription>}
                        </CardHeader>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="pdfs">
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant={selectedCourse === undefined ? "default" : "outline"} size="sm" onClick={() => setSelectedCourse(undefined)}>الكل</Button>
                {courses?.map((c) => (
                  <Button key={c.id} variant={selectedCourse === c.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCourse(c.id)}>{c.name}</Button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {loadingPdfs ? (
                  Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader></Card>)
                ) : !pdfs?.length ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">لا توجد ملفات</p>
                    </CardContent>
                  </Card>
                ) : (
                  pdfs.map((pdf) => (
                    <Card key={pdf.id} className="transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              {pdf.title}
                            </CardTitle>
                            {pdf.description && <CardDescription className="mt-1">{pdf.description}</CardDescription>}
                          </div>
                          {pdf.courseName && <Badge variant="secondary" className="mr-4">{pdf.courseName}</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {pdf.source !== "mega" ? (
                            <>
                              <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="default" size="sm" className="gap-1"><ExternalLink className="h-4 w-4" />عرض الملف</Button>
                              </a>
                              <a href={pdf.url} download>
                                <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" />تحميل</Button>
                              </a>
                            </>
                          ) : (
                            <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="default" size="sm" className="gap-1"><ExternalLink className="h-4 w-4" />فتح في Mega</Button>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingCourses ? (
                  Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-6 w-2/3" /><Skeleton className="h-16 w-full mt-2" /></CardHeader></Card>)
                ) : !courses?.length ? (
                  <Card className="col-span-full text-center py-12">
                    <CardContent>
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">لا توجد كورسات متاحة</p>
                    </CardContent>
                  </Card>
                ) : (
                  courses.map((course) => (
                    <Card key={course.id} className="transition-all hover:shadow-md hover:-translate-y-1 border-primary/10">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-lg">{course.name}</CardTitle>
                        </div>
                        {course.description && <CardDescription className="leading-relaxed">{course.description}</CardDescription>}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {course.duration && <div className="flex gap-2 text-muted-foreground"><span className="font-medium text-foreground">المدة:</span>{course.duration}</div>}
                          {course.schedule && <div className="flex gap-2 text-muted-foreground"><span className="font-medium text-foreground">الجدول:</span>{course.schedule}</div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
