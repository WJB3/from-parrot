The operation of the program will inevitably need to apply for memory resources. If the invalid object resources are not handled in time, they will always occupy the memory resources and eventually lead to memory overflow. Therefore, the management of memory resources is very important！

Reference counting algorithm and Tag scavenging algorithm have both advantages and disadvantages.


The reference counting algorithm has three advantages:1.High real-time, do not need to wait until the memory is insufficient before recycling 2.Applications do not need to be suspended during garbage collection. OuttofMember error is reported if memory is running out 3.Culture, with a counter for a new object, only updates that object and does not scan full objects .But has one disadvantages:Unable to solve the circular reference problem.

Tag scavenging algorithm has three advantages:1.Resolved the issue of circular references. Objects that are not referenced from the root node are recycled But have two advantages:1.Low efficiency, because both mark and clean actions traversal all objects and need to stop the application during GC 2.Cleaning up memory is more fragmented because reclaimed objects can be found in all corners of memory

From what has been discussed above I think Reference counting algorithm is better than Tag scavenging algorithm.